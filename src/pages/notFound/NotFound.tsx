import { Link } from 'react-router-dom';
import { getRouteMain } from '@/shared/const/router.ts';
import { Button } from 'antd';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Страница не найдена</p>
      <Link to={getRouteMain()} className="mt-6">
        <Button type={'primary'} shape={'round'} size={'large'}>
          На главную
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
