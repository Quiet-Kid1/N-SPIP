/**
 * Template HTML untuk email pengingat upload dokumen kartu kendali.
 * @param {string} namaDokumen - Nama dokumen / judul filter periode
 * @param {string} kategori    - Kategori kartu kendali
 * @param {string} pesan       - Isi pesan dari pengirim
 */
export const templatePengingatEmail = ({ namaDokumen, kategori, pesan }) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pengingat Upload Dokumen</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1d4ed8;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                KPU Kabupaten Bolaang Mongondow Timur
              </h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:13px;">
                Sistem Pengarsipan & Pengelolaan Kartu Kendali SPIP
              </p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#fef9c3;padding:14px 40px;border-bottom:1px solid #fde047;">
              <p style="margin:0;color:#854d0e;font-size:13px;font-weight:600;text-align:center;">
                ⚠️ &nbsp;PENGINGAT — SEGERA UPLOAD DOKUMEN KARTU KENDALI
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
                Yth. Bapak/Ibu,
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Kami ingin mengingatkan bahwa terdapat dokumen yang <strong>belum diupload</strong>
                pada sistem pengarsipan. Mohon segera melakukan pengunggahan dokumen berikut:
              </p>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;width:140px;color:#6b7280;font-size:13px;">Dokumen</td>
                        <td style="padding:6px 0;color:#1e40af;font-size:14px;font-weight:600;">: ${namaDokumen || "-"}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pesan dari pengirim -->
              ${
                pesan
                  ? `<div style="background:#f9fafb;border-left:4px solid #1d4ed8;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
                      <p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                        Pesan dari Admin
                      </p>
                      <p style="margin:0;color:#111827;font-size:14px;line-height:1.7;white-space:pre-line;">${pesan}</p>
                    </div>`
                  : ""
              }

              <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">
                Harap segera melakukan upload dokumen melalui sistem untuk menjaga kelengkapan
                dan ketaatan administrasi.
              </p>
              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                Apabila dokumen sudah diupload, abaikan email ini.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#374151;font-size:13px;font-weight:600;">
                KPU Kabupaten Bolaang Mongondow Timur
              </p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                Email ini dikirim otomatis oleh sistem. Mohon tidak membalas email ini.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
