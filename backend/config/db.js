import mongoose from "mongoose";


const connectDB = async () => {
    if (!process.env.MONGO_URI) {
		console.error('MONGO_URI is missing in .env file');
		process.exit(1);
	}
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(
			`MongoDB connected: ${conn.connection.host}`
		);
	} catch (error) {
		console.error(`MongoDB Error: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;
