import { StatusCodes } from 'http-status-codes';
import { createUserService } from '../services/user.service.js';
import { sendEmail } from '../utils/email.util.js';

export async function signupHandler(req, res) {
	const { name, email, password, cpassword } = req.body;
	try {
		// NOTE: password will be hashed in pre-middleware of user model
		const createdUser = await createUserService({ name, email, password });

		await sendEmail(
			email,
			'Verification code for nbyula appointment manager',
			`Your verification code is ${createdUser.verificationCode}`
		);

		return res
			.status(StatusCodes.OK)
			.json({ message: 'User created and email sent successfully' });
	} catch (err) {
		console.log(err);
		if (err.code === 11000) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ error: 'user with same email already exists' });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal Server Error' });
	}
}
