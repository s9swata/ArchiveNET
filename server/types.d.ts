import "express";

declare global {
	namespace Express {
		interface Request {
			userId?: string; // Optional userId for authenticated requests
			contract?: {
				contractId: string;
				userId: string;
				createdAt: number;
			};
		}
	}
}
