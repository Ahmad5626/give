const RecommendedCauses = require('../../models/RecommendedCauses');

const createRecommendedCauses = async (req, res) => {
    const {
        headline,
        category,
        pageHeadline,
        pageSubHeadline,
        pageCta,
        pageImage

    } = req.body;
    try {
        const recommendedCauses = new RecommendedCauses({
            headline,
            category,
            pageHeadline,
            pageSubHeadline,
            pageCta,
            pageImage
        });
        await recommendedCauses.save();
        res.status(201).json({
            success: true,
            message: "RecommendedCauses created successfully",
            data: recommendedCauses,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllRecommendedCauses = async (req, res) => {
    try {
        const recommendedCauses = await RecommendedCauses.find();
        res.status(200).json({
            success: true,
            message: "RecommendedCauses fetched successfully",
            data: recommendedCauses,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteRecommendedCauses = async (req, res) => {
    const { id } = req.params;
    try {
        const recommendedCauses = await RecommendedCauses.findOneAndDelete({_id: id});
        res.status(200).json(recommendedCauses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createRecommendedCauses, getAllRecommendedCauses, deleteRecommendedCauses };