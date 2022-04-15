// @ts-check
import getImage from "../utils/getImage.js";
import { globalConfigOptions } from "../runtimeChecks.js";
import getBackgroundStyles from "../utils/getBackgroundStyles.js";
import getImg from "../utils/getImg.js";
import getLink from "../utils/getLink.js";
import getLayoutStyles from "../utils/getLayoutStyles.js";

export default async function renderImg(props) {
  const {
    src,
    alt,
    sizes = (breakpoints) => {
      const maxWidth = breakpoints.at(-1);
      return `(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`;
    },
    preload,
    loading = preload ? "eager" : "lazy",
    decoding = "async",
    breakpoints,
    objectFit = "cover",
    objectPosition = "50% 50%",
    layout = "constrained",
    placeholder = "blurred",
    format,
    formatOptions = {
      tracedSVG: {
        function: "trace",
      },
    },
    ...restConfigOptions
  } = props;

  const artDirectives = [],
    fallbackFormat = format,
    fadeInTransition = false,
    includeSourceFormat = false;

    const type = "Img";

  const { uuid, images } = await getImage(
    src,
    type,
    sizes,
    format,
    breakpoints,
    placeholder,
    artDirectives,
    fallbackFormat,
    includeSourceFormat,
    formatOptions,
    restConfigOptions,
    globalConfigOptions
  );

  const className = `astro-imagetools-img-${uuid}`;

  const { imagesizes } = images.at(-1);

  const style = getBackgroundStyles(
    images,
    className,
    objectFit,
    objectPosition,
    fadeInTransition
  );

  const link = getLink(images, preload, imagesizes);

  const layoutStyles = getLayoutStyles({ layout });

  const sources = images.flatMap(({ sources, sizes, imagesizes }) =>
    sources.map(({ src, srcset }) =>
      getImg(
        src,
        alt,
        sizes,
        style,
        srcset,
        loading,
        decoding,
        imagesizes,
        fadeInTransition,
        layoutStyles,
        { imgClassName: className }
      )
    )
  );

  const [img] = sources;

  return { link, style, img };
}
