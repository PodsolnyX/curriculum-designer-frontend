import { Typography } from 'antd';

interface PageLoaderProps {
  loading?: boolean;
  title?: string;
}

const PageLoader = ({ loading, title }: PageLoaderProps) => {
  if (!loading) return null;

  return (
    <div
      className={
        'fixed z-50 left-0 top-0 w-screen h-screen bg-white/[.9] flex flex-col items-center justify-center'
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width={100}
        height={100}
      >
        <circle
          fill="#74a4a8"
          stroke="#74a4a8"
          strokeWidth="15"
          r="15"
          cx="40"
          cy="100"
        >
          <animate
            attributeName="opacity"
            calcMode="spline"
            dur="1"
            values="1;0;1;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.4"
          ></animate>
        </circle>
        <circle
          fill="#74a4a8"
          stroke="#74a4a8"
          strokeWidth="15"
          r="15"
          cx="100"
          cy="100"
        >
          <animate
            attributeName="opacity"
            calcMode="spline"
            dur="1"
            values="1;0;1;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.2"
          ></animate>
        </circle>
        <circle
          fill="#74a4a8"
          stroke="#74a4a8"
          strokeWidth="15"
          r="15"
          cx="160"
          cy="100"
        >
          <animate
            attributeName="opacity"
            calcMode="spline"
            dur="1"
            values="1;0;1;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="0"
          ></animate>
        </circle>
      </svg>
      <Typography.Text className={'text-center text-2xl'}>
        {title}
      </Typography.Text>
    </div>
  );
};

export default PageLoader;
