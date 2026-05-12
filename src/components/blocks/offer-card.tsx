import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface Offer {
  title: string;
  description: string;
}

interface OfferCardProps extends React.HTMLAttributes<HTMLDivElement> {
  offers: Offer[];
}

const cardBackgrounds = [
  OfferCardBackground1,
  OfferCardBackground2,
  OfferCardBackground3,
];

function OfferCard({ offers, className, ...props }: OfferCardProps) {
  return (
    <div
      data-slot="offer-card"
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {offers.map((offer, i) => {
        const Background =
          cardBackgrounds[i % cardBackgrounds.length];
        return (
          <div
            key={i}
            className="relative w-full overflow-hidden rounded-2xl text-white"
          >
            <Background />
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-12 text-center">
              <SealCheck
                weight="fill"
                className="size-11 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.2)] lg:size-24"
              />
              <div className="flex w-[77%] flex-col items-center gap-2">
                <h4 className="text-2xl font-bold leading-8 tracking-[-0.5px]">
                  {offer.title}
                </h4>
                <p className="text-sm leading-[22.75px]">
                  {offer.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OfferCardBackground1() {
  return (
    <svg
      className="absolute inset-0 size-full"
      width="341"
      height="448"
      viewBox="0 0 341 448"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_4182_2102)">
        <rect width="341" height="448" fill="white" />
        <rect width="341" height="448" fill="url(#paint0_linear_4182_2102)" />
        <g opacity="0.78" filter="url(#filter0_f_4182_2102)">
          <ellipse
            cx="306.384"
            cy="-5.95159"
            rx="110.334"
            ry="220.589"
            transform="rotate(-34.7473 306.384 -5.95159)"
            fill="#A0D5FB"
          />
        </g>
        <g opacity="0.78" filter="url(#filter1_f_4182_2102)">
          <ellipse
            cx="306.384"
            cy="-5.95149"
            rx="59.8353"
            ry="119.628"
            transform="rotate(-34.7473 306.384 -5.95149)"
            fill="white"
          />
        </g>
        <ellipse
          cx="321.5"
          cy="181"
          rx="132.5"
          ry="131"
          fill="url(#paint1_linear_4182_2102)"
          fillOpacity="0.3"
          stroke="url(#paint2_linear_4182_2102)"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <ellipse
          cx="38.5"
          cy="61"
          rx="207.5"
          ry="205"
          fill="url(#paint3_linear_4182_2102)"
          fillOpacity="0.3"
          stroke="url(#paint4_linear_4182_2102)"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_4182_2102"
          x="1.36981"
          y="-347.855"
          width="610.029"
          height="683.807"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="75"
            result="effect1_foregroundBlur_4182_2102"
          />
        </filter>
        <filter
          id="filter1_f_4182_2102"
          x="122.318"
          y="-210.023"
          width="368.133"
          height="408.143"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="50"
            result="effect1_foregroundBlur_4182_2102"
          />
        </filter>
        <linearGradient
          id="paint0_linear_4182_2102"
          x1="341"
          y1="0"
          x2="-8.63551e-06"
          y2="448"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58BAF2" />
          <stop offset="0.264291" stopColor="#007FEB" />
          <stop offset="0.492805" stopColor="#0025C5" />
          <stop offset="1" stopColor="#11072A" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4182_2102"
          x1="261"
          y1="96.5"
          x2="397.567"
          y2="177.476"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_4182_2102"
          x1="388.5"
          y1="203"
          x2="253.5"
          y2="118.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_4182_2102"
          x1="-169"
          y1="-51.6718"
          x2="158.304"
          y2="61.8425"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_4182_2102"
          x1="94.8774"
          y1="97.7748"
          x2="-150.845"
          y2="-103.49"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_4182_2102">
          <rect width="341" height="448" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function OfferCardBackground2() {
  return (
    <svg
      className="absolute inset-0 size-full"
      width="341"
      height="448"
      viewBox="0 0 341 448"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_4182_2113)">
        <rect width="341" height="448" fill="white" />
        <rect width="341" height="448" fill="url(#paint0_linear_4182_2113)" />
        <g opacity="0.78" filter="url(#filter0_f_4182_2113)">
          <ellipse
            cx="306.384"
            cy="-5.95159"
            rx="110.334"
            ry="220.589"
            transform="rotate(-34.7473 306.384 -5.95159)"
            fill="#A0D5FB"
          />
        </g>
        <g opacity="0.78" filter="url(#filter1_f_4182_2113)">
          <ellipse
            cx="306.384"
            cy="-5.95149"
            rx="59.8353"
            ry="119.628"
            transform="rotate(-34.7473 306.384 -5.95149)"
            fill="white"
          />
        </g>
        <path
          d="M404.593 -78.9888C333.465 54.1759 233.012 137.128 117.817 167.995C3.31913 198.674 -116.939 175.534 -224 113.723L-160.146 3.12506C-76.6296 51.3435 8.91717 64.9619 84.7635 44.6389C159.912 24.5029 234.342 -31.3088 291.949 -139.157L404.593 -78.9888Z"
          fill="url(#paint1_linear_4182_2113)"
          fillOpacity="0.3"
          stroke="url(#paint2_linear_4182_2113)"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M-177.697 304.604C-58.1376 176.879 79.1849 114.154 217.388 114.154C354.754 114.154 482.426 176.125 583.726 277.426L479.079 382.072C400.056 303.049 308.383 262.147 217.388 262.147C127.23 262.147 27.1763 302.297 -69.6531 405.74L-177.697 304.604Z"
          fill="url(#paint3_linear_4182_2113)"
          fillOpacity="0.3"
          stroke="url(#paint4_linear_4182_2113)"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_4182_2113"
          x="1.36981"
          y="-347.855"
          width="610.029"
          height="683.807"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="75"
            result="effect1_foregroundBlur_4182_2113"
          />
        </filter>
        <filter
          id="filter1_f_4182_2113"
          x="122.318"
          y="-210.023"
          width="368.133"
          height="408.143"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="50"
            result="effect1_foregroundBlur_4182_2113"
          />
        </filter>
        <linearGradient
          id="paint0_linear_4182_2113"
          x1="341"
          y1="0"
          x2="-8.63551e-06"
          y2="448"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58BAF2" />
          <stop offset="0.194041" stopColor="#007FEB" />
          <stop offset="0.510758" stopColor="#0025C5" />
          <stop offset="1" stopColor="#11072A" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4182_2113"
          x1="143.109"
          y1="9.51498"
          x2="221.343"
          y2="168.245"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_4182_2113"
          x1="127.375"
          y1="-15.9267"
          x2="246.587"
          y2="140.78"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_4182_2113"
          x1="141.544"
          y1="283.964"
          x2="119.5"
          y2="155"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_4182_2113"
          x1="151.525"
          y1="317.161"
          x2="108"
          y2="187.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_4182_2113">
          <rect width="341" height="448" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function OfferCardBackground3() {
  return (
    <svg
      className="absolute inset-0 size-full"
      width="341"
      height="448"
      viewBox="0 0 341 448"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_4182_2124)">
        <rect width="341" height="448" fill="white" />
        <rect width="341" height="448" fill="url(#paint0_linear_4182_2124)" />
        <ellipse
          cx="0.115128"
          cy="156.36"
          rx="161.5"
          ry="159.5"
          transform="rotate(29.5108 0.115128 156.36)"
          fill="url(#paint1_linear_4182_2124)"
          fillOpacity="0.3"
          stroke="url(#paint2_linear_4182_2124)"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <g opacity="0.78" filter="url(#filter0_f_4182_2124)">
          <ellipse
            cx="0.137396"
            cy="0.384531"
            rx="110.334"
            ry="220.589"
            transform="rotate(-124.747 0.137396 0.384531)"
            fill="#A0D5FB"
          />
        </g>
        <g opacity="0.78" filter="url(#filter1_f_4182_2124)">
          <ellipse
            cx="0.137495"
            cy="0.384293"
            rx="59.8353"
            ry="119.628"
            transform="rotate(-124.747 0.137495 0.384293)"
            fill="white"
          />
        </g>
        <path
          d="M370.181 421.939C240.499 344.644 162.348 240.411 136.918 123.895C111.642 8.08497 140.396 -110.956 207.16 -215L314.642 -146.03C262.56 -64.8666 244.944 19.9474 261.688 96.6634C278.278 172.673 330.538 249.639 435.566 312.24L370.181 421.939Z"
          fill="url(#paint3_linear_4182_2124)"
          fillOpacity="0.3"
          stroke="url(#paint4_linear_4182_2124)"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_4182_2124"
          x="-341.766"
          y="-304.63"
          width="683.807"
          height="610.03"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="75"
            result="effect1_foregroundBlur_4182_2124"
          />
        </filter>
        <filter
          id="filter1_f_4182_2124"
          x="-203.934"
          y="-183.682"
          width="408.143"
          height="368.133"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="50"
            result="effect1_foregroundBlur_4182_2124"
          />
        </filter>
        <linearGradient
          id="paint0_linear_4182_2124"
          x1="0"
          y1="0"
          x2="341"
          y2="448"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58BAF2" />
          <stop offset="0.240508" stopColor="#007FEB" />
          <stop offset="0.494579" stopColor="#0025C5" />
          <stop offset="1" stopColor="#11072A" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4182_2124"
          x1="102.11"
          y1="63.7425"
          x2="-10.6055"
          y2="162.014"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_4182_2124"
          x1="29.8617"
          y1="139.109"
          x2="106.207"
          y2="78.0853"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_4182_2124"
          x1="294.037"
          y1="156.592"
          x2="131.813"
          y2="227.296"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_4182_2124"
          x1="320.189"
          y1="142.068"
          x2="158.064"
          y2="253.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_4182_2124">
          <rect width="341" height="448" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export { OfferCard };
export type { OfferCardProps, Offer };
