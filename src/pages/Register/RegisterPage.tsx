import { App, Button, Input, Typography } from 'antd';
import { RegisterDto } from '@/api/axios-client.types.ts';
import { useState } from 'react';
import { useRegisterMutation } from '@/api/axios-client/AuthQuery.ts';
import { useAuth } from '@/app/providers/AuthProvider.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { getRouteMain } from '@/shared/const/router.ts';
import { AxiosError } from 'axios';

const RegisterPage = () => {
  const [data, setData] = useState<RegisterDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const { message } = App.useApp();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const { mutate: register, isPending } = useRegisterMutation({
    onSuccess: (data) => {
      message.success('Вы успешно зарегистрировались в системе');
      signIn(data.accessToken, data.refreshToken, false);
      navigate(getRouteMain(), { replace: true });
    },
    onError: (error: AxiosError) => {
      //@ts-ignore
      message.error(error.response?.message);
    },
  });

  const onSubmit = () => {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      message.info('Пожалуйста, введите все поля');
      return;
    }
    register(data);
  };

  return (
    <div
      className={
        'h-screen w-screen bg-cover bg-center flex flex-col items-center lg:items-end justify-center lg:pr-48'
      }
      style={{ backgroundImage: 'url(/assets/login.jpg)' }}
    >
      <div
        className={
          'bg-white p-16 pb-24 rounded-xl max-w-[500px] w-full flex flex-col shadow-xl'
        }
      >
        <Typography.Text className={'text-3xl font-bold'}>
          TSU.Plan
        </Typography.Text>
        <Typography.Text className={'text-2xl'}>
          Регистрация в системе
        </Typography.Text>
        <form className={'mt-12 flex flex-col'}>
          <Typography.Text className={'text-lg'}>Имя</Typography.Text>
          <Input
            size={'large'}
            className={'mb-2'}
            value={data.firstName}
            disabled={isPending}
            onChange={(event) =>
              setData({ ...data, firstName: event.target.value })
            }
          />
          <Typography.Text className={'text-lg'}>Фамилия</Typography.Text>
          <Input
            size={'large'}
            className={'mb-2'}
            value={data.lastName}
            disabled={isPending}
            onChange={(event) =>
              setData({ ...data, lastName: event.target.value })
            }
          />
          <Typography.Text className={'text-lg'}>Почта</Typography.Text>
          <Input
            size={'large'}
            className={'mb-2'}
            value={data.email}
            disabled={isPending}
            onChange={(event) =>
              setData({ ...data, email: event.target.value })
            }
          />
          <Typography.Text className={'text-lg'}>Пароль</Typography.Text>
          <Input.Password
            size={'large'}
            value={data.password}
            disabled={isPending}
            onChange={(event) =>
              setData({ ...data, password: event.target.value })
            }
          />
          <Button
            type={'primary'}
            className={'w-full mt-8'}
            shape={'round'}
            size={'large'}
            loading={isPending}
            onClick={onSubmit}
          >
            Зарегистрироваться
          </Button>
          <Typography.Text
            className={'text-sm text-center text-stone-400 mt-2'}
          >
            Есть аккаунт?{' '}
            <Link to={getRouteMain()} className={'text-sm'}>
              Войти в систему
            </Link>
          </Typography.Text>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
