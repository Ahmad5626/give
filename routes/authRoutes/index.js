const express = require('express');
const router = express.Router();

const { registerUser, loginUser, googleLogin, updateUser, getUsers, deleteUser, chekcAuthData, facebookLogin } = require('../../controllers/authController/index');
const { authenticate } = require('../../middleware/auth-middleware');
router.post("/google-login", googleLogin);
router.post("/facebook-login", facebookLogin);
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/update-user', authenticate, updateUser)
router.get('/get-user-data', getUsers)
router.delete('/delete-user/:id', deleteUser)

router.get("/check-auth", authenticate, chekcAuthData)   
module.exports = router