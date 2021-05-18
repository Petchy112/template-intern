export default (logoPath: string, email: string, token: string, urlVerifyAccount: string): string => {
    const verifyAccountTemplate = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>7 DAYS BETTER YOU</title>
        <style>
            .mg-b-12 {margin-bottom: 12px}
            .mg-b-24 {margin-bottom: 24px}
            .mg-b-26 {margin-bottom: 26px}
            .mg-b-32 {margin-bottom: 32px}
            .mg-b-34 {margin-bottom: 34px}
            .mg-b-40 {margin-bottom: 40px}
            .em-body {
                font-family: Arial, Helvetica, sans-serif;
            }
            .em-logo {
                font-family: Arial, Helvetica, sans-serif;
                font-weight: bold;
                font-size: 20px;
                color:#062A3A;
                text-transform: uppercase;
            }
            .em-title {
                font-size: 24px;
                font-weight: bold;
                color: #373A3C;
            }
            .em-detail {
                font-size: 14px;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.65);
            }
            .em-detail-sm {
                font-size: 12px;
                font-weight: normal;
                color: rgba(0, 0, 0, 0.65);
                word-break: break-all;
                line-height: 1.4;
            }
            .em-detail-sm a {
                color: #2196F3;
                text-decoration: underline;
                cursor: pointer;
            }
            .em-button {
                background-color: #062A3A;
                padding: 14px;
                color: #ffffff !important;
                border-radius: 8px;
                text-transform: uppercase;
                text-align: center;
                font-size: 14px;
                cursor: pointer;
                display: block;
                text-decoration: none;
            }
            .em-footer-menu {
                display: table-row;
                padding: 0;
            }
            .em-footer-menu li {
                display: table-cell;
                width: 80px;
                text-align: center;
                border-right: 1px solid rgba(0, 0, 0, 0.05);
            }
            .em-footer-menu li:last-child {
                border-right: none;
            }
            .em-footer-menu li a {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                font-weight: bold;
                color: #4A4A4A;
                text-decoration: none;
            }
            .em-footer-address {
                font-family: Arial, Helvetica, sans-serif;
                font-weight: 400;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.45);
                margin-top: 16px;
                text-transform: capitalize;
            }
        </style>
    </head>
    <body style="margin: 0px; padding: 0px">
        <table valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tbody>
                <tr>
                    <td valign="top" align="center" bgcolor="#F7F7F7" style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
                        <table style="width:548px; height: 114px;" width="700" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tbody>
                                <tr>
                                    <td style="padding: 34px 6px 24px 24px; width: 32px;">
                                        <img src="${logoPath}" alt="logo" style="width: 32px; height: 32px">
                                    </td>
                                    <td style="padding: 34px 0px 24px 0px;" class="em-logo">
                                        Digital Talent Academy
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 48px 0 56px;">
                        <div class="em-body" style="width: 500px; margin: 0 auto">
                            <div class="em-title mg-b-32">ยืนยันบัญชีผู้ใช้</div>
                            <div class="em-detail mg-b-24">กรุณายืนยันบัญชีผู้ใช้ใหม่สำหรับบัญชี <b>${email}</b> โดยคลิ๊กปุ่มด้านล่าง:</div>
                            <a class="em-button mg-b-34" href="${urlVerifyAccount}" target="_blank">
                                คลิ๊กเพื่อยืนยันบัญชีผู้ใช้ใหม่
                            </a>
                            <div class="em-detail-sm mg-b-40">หากปุ่มไม่ทำงาน กรุณาคัดลอก URL หรือกดลิ้งค์ต่อไปนี้:
                                <a href="${urlVerifyAccount}" target="_blank">
                                link
                                </a>
                            </div>
                            <div class="em-detail mg-b-12">ขอบคุณค่ะ</div>
                            <div class="em-detail mg-b-32" style="text-transform: uppercase;">Digital Talent Academy</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td valign="top" align="center" bgcolor="#F7F7F7" style="border-top: 1px solid rgba(0, 0, 0, 0.05)">
                        <table style="width:548px; height: 114px;" width="700" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tbody>
                                <tr>
                                    <td align="center" style="padding: 32px 24px 40px;">
                                        <div class="em-footer-address">Digital Talent Academy Office,</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>`

    return verifyAccountTemplate
}
