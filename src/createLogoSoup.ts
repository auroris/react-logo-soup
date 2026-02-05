import { DEFAULT_ALIGN_BY, DEFAULT_GAP } from "./constants";
import { processLogos } from "./processLogos";
import type { LogoSoupOptions } from "./types";
import { getVisualCenterTransform } from "./utils/getVisualCenterTransform";

export async function createLogoSoup(
  options: LogoSoupOptions,
): Promise<HTMLDivElement> {
  const {
    alignBy = DEFAULT_ALIGN_BY,
    gap = DEFAULT_GAP,
    renderImage,
    className,
    style,
    onNormalized,
    ...processOptions
  } = options;

  const normalizedLogos = await processLogos(processOptions);

  if (onNormalized) {
    onNormalized(normalizedLogos);
  }

  const container = document.createElement("div");
  if (className) container.className = className;
  container.style.textAlign = "center";
  container.style.textWrap = "balance";
  if (style) Object.assign(container.style, style);

  const halfGap =
    typeof gap === "number" ? `${gap / 2}px` : `calc(${gap} / 2)`;

  for (const logo of normalizedLogos) {
    const transform = getVisualCenterTransform(logo, alignBy);

    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-block";
    wrapper.style.verticalAlign = "middle";
    wrapper.style.padding = halfGap;

    const imgStyle: Record<string, string> = {
      display: "block",
      width: `${logo.normalizedWidth}px`,
      height: `${logo.normalizedHeight}px`,
      objectFit: "contain",
    };
    if (transform) imgStyle.transform = transform;

    let imgElement: HTMLElement;
    if (renderImage) {
      imgElement = renderImage({
        src: logo.croppedSrc || logo.src,
        alt: logo.alt,
        width: logo.normalizedWidth,
        height: logo.normalizedHeight,
        style: imgStyle,
      });
    } else {
      const img = document.createElement("img");
      img.src = logo.croppedSrc || logo.src;
      img.alt = logo.alt;
      img.width = logo.normalizedWidth;
      img.height = logo.normalizedHeight;
      Object.assign(img.style, imgStyle);
      imgElement = img;
    }

    wrapper.appendChild(imgElement);
    container.appendChild(wrapper);
  }

  return container;
}
