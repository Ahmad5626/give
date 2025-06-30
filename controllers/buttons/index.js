const Allbuttons = require('../../models/Allbuttons');

const CreateAllbuttons = async (req, res) => {
    const {
        heroSectionButton,
        honorTheirButton,
        fundraiseWithFaithButton,
        discoveryButton
      } = req.body;
        try {
            const allbuttons =  new Allbuttons({
                heroSectionButton,
                honorTheirButton,
                fundraiseWithFaithButton,
                discoveryButton
            });
            await allbuttons.save();
            res.status(200).json({
                success: true,
                message: 'Allbuttons created successfully',
                data: allbuttons,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const getAllbuttons = async (req, res) => {
     try {
           const id="6836a3679fe119b98ac0e436"
    const allbuttons = await Allbuttons.findOne({_id:id});
    res.status(200).json({success: true, message: 'Allbuttons fetched successfully', data: allbuttons});
    return allbuttons;
     } catch (error) {
        res.status(500).json({ error: error.message });
     }
}
const updatebutton =async(req,res)=>{
const id="6836a3679fe119b98ac0e436"
const {heroSectionButton,honorTheirButton,fundraiseWithFaithButton,discoveryButton}=req.body
try {
    const allbuttons = await Allbuttons.findOneAndUpdate({_id:id},{
        heroSectionButton,
        honorTheirButton,
        fundraiseWithFaithButton,
        discoveryButton
    },{new:true});
    res.status(200).json({success: true, message: 'Allbuttons updated successfully', data: allbuttons});
    return allbuttons;
} catch (error) {
    res.status(500).json({ error: error.message });
}
}
module.exports = {CreateAllbuttons,getAllbuttons,updatebutton}    