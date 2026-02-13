declare class EmailService {
    private transporter;
    constructor();
    sendOTP(to: string, otp: string): Promise<boolean>;
    sendPasswordResetOTP(to: string, otp: string): Promise<boolean>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=email.service.d.ts.map