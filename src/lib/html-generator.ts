import type {
  EmailElement,
  EmailTemplate,
  TextElement,
  HeadingElement,
  ImageElement,
  ButtonElement,
  DividerElement,
  SpacerElement,
  VideoElement,
  GifElement,
  TimerElement,
  SocialElement,
  ColumnsElement,
  HtmlElement,
  FooterElement,
  HeaderElement,
} from "@/types/builder";

// ── Email-safe HTML Generator ──
// Generates table-based HTML compatible with all major email clients

function inlineStyles(styles: Record<string, string | undefined>): string {
  return Object.entries(styles)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}

function generateText(el: TextElement): string {
  const style = inlineStyles({
    "font-size": el.styles.fontSize || "16px",
    "font-family": el.styles.fontFamily || "Arial, sans-serif",
    "font-weight": el.styles.fontWeight || "normal",
    color: el.styles.color || "#333333",
    "text-align": el.styles.textAlign || "left",
    "line-height": el.styles.lineHeight || "1.6",
    padding: el.styles.padding || "10px 0",
    margin: "0",
  });
  return `<p style="${style}">${el.content}</p>`;
}

function generateHeading(el: HeadingElement): string {
  const sizes: Record<number, string> = { 1: "32px", 2: "24px", 3: "20px" };
  const style = inlineStyles({
    "font-size": el.styles.fontSize || sizes[el.level],
    "font-family": el.styles.fontFamily || "Arial, sans-serif",
    "font-weight": el.styles.fontWeight || "bold",
    color: el.styles.color || "#111111",
    "text-align": el.styles.textAlign || "left",
    "line-height": "1.3",
    padding: el.styles.padding || "10px 0",
    margin: "0",
  });
  return `<h${el.level} style="${style}">${el.content}</h${el.level}>`;
}

function generateImage(el: ImageElement): string {
  const imgStyle = inlineStyles({
    display: "block",
    width: el.styles.width || "100%",
    "max-width": el.styles.maxWidth || "100%",
    height: "auto",
    "border-radius": el.styles.borderRadius || "0",
    border: "0",
  });
  const img = `<img src="${el.src}" alt="${el.alt}" style="${imgStyle}" />`;
  if (el.link) {
    return `<a href="${el.link}" target="_blank" style="display: block;">${img}</a>`;
  }
  return img;
}

function generateButton(el: ButtonElement): string {
  const tdStyle = inlineStyles({
    "background-color": el.buttonColor || "#4F46E5",
    "border-radius": el.borderRadius || "6px",
    "text-align": "center",
    padding: "0",
  });
  const linkStyle = inlineStyles({
    display: "inline-block",
    "font-family": el.styles.fontFamily || "Arial, sans-serif",
    "font-size": el.styles.fontSize || "16px",
    "font-weight": "bold",
    color: el.textColor || "#ffffff",
    "text-decoration": "none",
    padding: "14px 32px",
    "border-radius": el.borderRadius || "6px",
    "background-color": el.buttonColor || "#4F46E5",
  });
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 10px auto;">
  <tr>
    <td style="${tdStyle}">
      <a href="${el.link}" target="_blank" style="${linkStyle}">${el.text}</a>
    </td>
  </tr>
</table>`;
}

function generateDivider(el: DividerElement): string {
  const hrStyle = inlineStyles({
    border: "0",
    "border-top": `${el.thickness || "1px"} solid ${el.dividerColor || "#e5e7eb"}`,
    width: el.dividerWidth || "100%",
    margin: el.styles.margin || "20px auto",
  });
  return `<hr style="${hrStyle}" />`;
}

function generateSpacer(el: SpacerElement): string {
  return `<div style="height: ${el.height || "20px"}; line-height: ${el.height || "20px"}; font-size: 1px;">&nbsp;</div>`;
}

function generateVideo(el: VideoElement): string {
  const imgStyle = inlineStyles({
    display: "block",
    width: el.styles.width || "100%",
    "max-width": "100%",
    height: "auto",
    "border-radius": el.styles.borderRadius || "0",
    border: "0",
  });

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="text-align: center; position: relative;">
      <a href="${el.videoUrl}" target="_blank" style="display: block; position: relative;">
        <img src="${el.thumbnailSrc}" alt="${el.alt}" style="${imgStyle}" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; background: rgba(0,0,0,0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <div style="width: 0; height: 0; border-style: solid; border-width: 12px 0 12px 20px; border-color: transparent transparent transparent #ffffff; margin-left: 4px;"></div>
        </div>
      </a>
    </td>
  </tr>
</table>`;
}

function generateGif(el: GifElement): string {
  const imgStyle = inlineStyles({
    display: "block",
    width: el.styles.width || "100%",
    "max-width": "100%",
    height: "auto",
    "border-radius": el.styles.borderRadius || "0",
  });
  const img = `<img src="${el.src}" alt="${el.alt}" style="${imgStyle}" />`;
  if (el.link) {
    return `<a href="${el.link}" target="_blank" style="display: block;">${img}</a>`;
  }
  return img;
}

function generateTimer(el: TimerElement): string {
  const containerStyle = inlineStyles({
    "text-align": "center",
    padding: el.styles.padding || "20px",
    "font-family": "Arial, sans-serif",
  });
  const digitStyle = inlineStyles({
    display: "inline-block",
    "background-color": el.timerColor || "#4F46E5",
    color: "#ffffff",
    "font-size": "28px",
    "font-weight": "bold",
    padding: "12px 16px",
    "border-radius": "8px",
    margin: "0 4px",
    "min-width": "48px",
    "text-align": "center",
  });
  const labelStyle = inlineStyles({
    display: "block",
    "font-size": "11px",
    color: el.labelColor || "#666666",
    "margin-top": "6px",
    "text-transform": "uppercase",
    "letter-spacing": "1px",
  });

  return `
<div style="${containerStyle}" data-timer-target="${el.targetDate}">
  <p style="margin: 0 0 8px; font-size: 14px; color: ${el.labelColor || "#666666"};">${el.label}</p>
  <div>
    <span style="${digitStyle}">00<span style="${labelStyle}">Days</span></span>
    <span style="${digitStyle}">00<span style="${labelStyle}">Hours</span></span>
    <span style="${digitStyle}">00<span style="${labelStyle}">Min</span></span>
    <span style="${digitStyle}">00<span style="${labelStyle}">Sec</span></span>
  </div>
</div>`;
}

function generateSocial(el: SocialElement): string {
  const size = el.iconSize || "32px";
  const icons = el.links
    .map(
      (link) =>
        `<a href="${link.url}" target="_blank" style="display: inline-block; margin: 0 6px; text-decoration: none;">
        <img src="${link.icon}" alt="${link.platform}" width="${parseInt(size)}" height="${parseInt(size)}" style="display: block; border: 0;" />
      </a>`,
    )
    .join("\n      ");

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="text-align: center; padding: ${el.styles.padding || "10px 0"};">
      ${icons}
    </td>
  </tr>
</table>`;
}

function generateColumns(el: ColumnsElement): string {
  const colCount = el.columns.length;
  const cols = el.columns
    .map((col) => {
      const content = col.elements.map(generateElement).join("\n");
      return `
    <td style="width: ${col.width || `${Math.floor(100 / colCount)}%`}; vertical-align: top; padding: 0 8px;">
      ${content}
    </td>`;
    })
    .join("");

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>${cols}
  </tr>
</table>`;
}

function generateHtml(el: HtmlElement): string {
  return el.rawHtml;
}

function generateFooter(el: FooterElement): string {
  const textColor = el.textColor || "#9ca3af";
  const dividerColor = el.dividerColor || "#e5e7eb";
  const bgColor = el.styles.backgroundColor || "#f9fafb";

  const socialHtml = el.showSocial && el.socialLinks.length > 0
    ? `<div style="text-align: center; padding: 0 0 16px;">
        ${el.socialLinks.map((link) =>
          `<a href="${link.url}" target="_blank" style="display: inline-block; margin: 0 4px; text-decoration: none;">
            <img src="${link.icon}" alt="${link.platform}" width="24" height="24" style="display: block; border: 0;" />
          </a>`
        ).join("\n        ")}
      </div>` : "";

  const linksHtml = el.links.length > 0
    ? `<p style="margin: 0 0 12px; font-size: 12px; color: ${textColor}; text-align: center;">
        ${el.links.map((link) => `<a href="${link.url}" style="color: ${textColor}; text-decoration: underline;">${link.label}</a>`).join(" &nbsp;|&nbsp; ")}
      </p>` : "";

  const addressHtml = el.showAddress && el.companyAddress
    ? `<p style="margin: 0 0 8px; font-size: 11px; color: ${textColor}; text-align: center; line-height: 1.5;">
        ${el.companyName} | ${el.companyAddress}
      </p>` : "";

  const legalHtml = `<p style="margin: 0 0 8px; font-size: 11px; color: ${textColor}; text-align: center; line-height: 1.5;">
    <a href="${el.unsubscribeUrl}" style="color: ${textColor}; text-decoration: underline;">Unsubscribe</a>
    &nbsp;|&nbsp;
    <a href="${el.preferencesUrl}" style="color: ${textColor}; text-decoration: underline;">Email Preferences</a>
    &nbsp;|&nbsp;
    <a href="${el.privacyUrl}" style="color: ${textColor}; text-decoration: underline;">Privacy Policy</a>
    &nbsp;|&nbsp;
    <a href="${el.termsUrl}" style="color: ${textColor}; text-decoration: underline;">Terms of Service</a>
  </p>`;

  const copyrightHtml = `<p style="margin: 8px 0 0; font-size: 10px; color: ${textColor}; text-align: center; opacity: 0.7;">
    &copy; ${new Date().getFullYear()} ${el.companyName}. All rights reserved.
  </p>`;

  const transactionalNotice = el.variant === "transactional"
    ? `<p style="margin: 8px 0 0; font-size: 10px; color: ${textColor}; text-align: center; opacity: 0.6;">
        This is a transactional email related to your account activity.
      </p>` : "";

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="background-color: ${bgColor}; padding: 24px 20px; border-top: 1px solid ${dividerColor};">
      ${socialHtml}
      ${linksHtml}
      ${addressHtml}
      ${legalHtml}
      ${copyrightHtml}
      ${transactionalNotice}
    </td>
  </tr>
</table>`;
}

function generateHeader(el: HeaderElement): string {
  const bgColor = el.backgroundColor || "#ffffff";
  const textColor = el.textColor || "#374151";
  const navColor = el.navColor || textColor;
  const navFontSize = el.navFontSize || "13px";
  const navStyle = el.navStyle || "text";
  const logoPosition = el.logoPosition || "left";
  const navPosition = el.navPosition || "right";
  const borderBottom = el.borderBottom || "";

  // ── Announcement Bar ──
  const announcementHtml = el.showAnnouncement && el.announcementText
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="background-color: ${el.announcementBg || "#4F46E5"}; color: ${el.announcementTextColor || "#ffffff"}; font-size: 12px; font-weight: 600; text-align: center; padding: 8px 16px; letter-spacing: 0.5px; font-family: Arial, sans-serif;">
            ${el.announcementText}
          </td>
        </tr>
      </table>` : "";

  // ── Preheader ──
  const preheaderHtml = el.preheaderText
    ? `<p style="margin: 0 0 12px; font-size: 11px; color: #9ca3af; text-align: center; font-family: Arial, sans-serif;">${el.preheaderText}</p>` : "";

  // ── Logo + Tagline ──
  const logoWidth = parseInt(el.logoWidth || "180");
  const taglineHtml = el.tagline
    ? `<p style="margin: 4px 0 0; font-size: ${el.taglineFontSize || "12px"}; color: ${el.taglineColor || "#6b7280"}; font-family: Arial, sans-serif;">${el.tagline}</p>` : "";
  const logoBlockHtml = `<div style="display: inline-block;">
    <img src="${el.logoSrc}" alt="${el.logoAlt}" width="${logoWidth}" style="display: block; border: 0; height: auto;" />
    ${taglineHtml}
  </div>`;

  // ── Nav Links ──
  const navLinks = el.navLinks || [];
  const navLinkHtml = navLinks.length > 0
    ? navLinks.map((link) => {
        if (navStyle === "pills") {
          return `<a href="${link.url}" style="display: inline-block; color: ${navColor}; font-size: ${navFontSize}; text-decoration: none; background-color: ${navColor}18; padding: 5px 14px; border-radius: 999px; margin: 0 3px; font-family: Arial, sans-serif;">${link.label}</a>`;
        }
        if (navStyle === "underline") {
          return `<a href="${link.url}" style="color: ${navColor}; font-size: ${navFontSize}; text-decoration: none; border-bottom: 2px solid ${navColor}; padding-bottom: 2px; margin: 0 10px; font-family: Arial, sans-serif;">${link.label}</a>`;
        }
        if (navStyle === "bold") {
          return `<a href="${link.url}" style="color: ${navColor}; font-size: ${navFontSize}; text-decoration: none; font-weight: 700; margin: 0 10px; font-family: Arial, sans-serif;">${link.label}</a>`;
        }
        return `<a href="${link.url}" style="color: ${navColor}; font-size: ${navFontSize}; text-decoration: none; margin: 0 10px; font-family: Arial, sans-serif;">${link.label}</a>`;
      }).join("")
    : "";

  // ── CTA Button ──
  const ctaHtml = el.showCta && el.ctaText
    ? `<a href="${el.ctaUrl || "#"}" style="display: inline-block; background-color: ${el.ctaColor || "#4F46E5"}; color: ${el.ctaTextColor || "#ffffff"}; padding: 8px 20px; border-radius: ${el.ctaBorderRadius || "6px"}; font-size: 13px; font-weight: 600; text-decoration: none; margin-left: 12px; font-family: Arial, sans-serif;">${el.ctaText}</a>`
    : "";

  const isCentered = logoPosition === "center";
  const isNavBelow = navPosition === "below";
  const tdBorderStyle = borderBottom ? `border-bottom: ${borderBottom};` : "";

  let innerHtml: string;

  if (isCentered) {
    innerHtml = `
      ${preheaderHtml}
      <div style="text-align: center;">
        ${logoBlockHtml}
      </div>
      ${navLinkHtml ? `<div style="margin-top: 10px; text-align: center;">${navLinkHtml}${ctaHtml}</div>` : (ctaHtml ? `<div style="margin-top: 10px; text-align: center;">${ctaHtml}</div>` : "")}`;
  } else if (isNavBelow) {
    const logoAlign = logoPosition === "right" ? "right" : "left";
    innerHtml = `
      ${preheaderHtml}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align: middle; text-align: ${logoAlign};">
            ${logoBlockHtml}
          </td>
          ${ctaHtml ? `<td style="vertical-align: middle; text-align: right;">${ctaHtml}</td>` : ""}
        </tr>
      </table>
      ${navLinkHtml ? `<div style="margin-top: 10px; text-align: ${logoAlign};">${navLinkHtml}</div>` : ""}`;
  } else {
    // Horizontal layout
    const isLogoRight = logoPosition === "right";
    const navAlign = navPosition === "left" ? "left" : navPosition === "center" ? "center" : "right";

    if (isLogoRight) {
      innerHtml = `
        ${preheaderHtml}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            ${navLinkHtml || ctaHtml ? `<td style="vertical-align: middle; text-align: ${navAlign};">${navLinkHtml}${ctaHtml}</td>` : ""}
            <td style="vertical-align: middle; text-align: right;">
              ${logoBlockHtml}
            </td>
          </tr>
        </table>`;
    } else {
      innerHtml = `
        ${preheaderHtml}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="vertical-align: middle;">
              ${logoBlockHtml}
            </td>
            ${navLinkHtml || ctaHtml ? `<td style="vertical-align: middle; text-align: ${navAlign};">${navLinkHtml}${ctaHtml}</td>` : ""}
          </tr>
        </table>`;
    }
  }

  return `${announcementHtml}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="background-color: ${bgColor}; padding: ${el.styles.padding || "16px 0"};${tdBorderStyle}">
      ${innerHtml}
    </td>
  </tr>
</table>`;
}

function generateElement(el: EmailElement): string {
  const wrapperStyle = inlineStyles({
    "background-color": el.styles.backgroundColor,
    padding: el.styles.padding,
    margin: el.styles.margin,
  });

  let inner: string;
  switch (el.type) {
    case "text":
      inner = generateText(el);
      break;
    case "heading":
      inner = generateHeading(el);
      break;
    case "image":
      inner = generateImage(el);
      break;
    case "button":
      inner = generateButton(el);
      break;
    case "divider":
      inner = generateDivider(el);
      break;
    case "spacer":
      inner = generateSpacer(el);
      break;
    case "video":
      inner = generateVideo(el);
      break;
    case "gif":
      inner = generateGif(el);
      break;
    case "timer":
      inner = generateTimer(el);
      break;
    case "social":
      inner = generateSocial(el);
      break;
    case "columns":
      inner = generateColumns(el);
      break;
    case "html":
      inner = generateHtml(el);
      break;
    case "footer":
      inner = generateFooter(el);
      break;
    case "header":
      inner = generateHeader(el);
      break;
  }

  if (wrapperStyle) {
    return `<div style="${wrapperStyle}">${inner}</div>`;
  }
  return inner;
}

export function generateEmailHtml(template: EmailTemplate): string {
  const elements = template.elements.map(generateElement).join("\n\n");

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${template.subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${template.bodyBackground || "#f4f4f7"}; font-family: ${template.fontFamily || "Arial, sans-serif"};">
  ${template.preheader ? `<div style="display: none; max-height: 0px; overflow: hidden;">${template.preheader}</div>` : ""}

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${template.bodyBackground || "#f4f4f7"};">
    <tr>
      <td style="padding: 20px 0;" align="center">
        <!--[if mso]>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${parseInt(template.contentWidth) || 600}">
        <tr><td>
        <![endif]-->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" style="max-width: ${template.contentWidth || "600px"}; width: 100%; background-color: ${template.contentBackground || "#ffffff"}; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 0 24px;">
              ${elements}
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td></tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateElementHtml(el: EmailElement): string {
  return generateElement(el);
}
