import {App, Button, Checkbox, Input, Typography} from "antd";
import {LoginDto} from "@/api/axios-client.types.ts";
import {useState} from "react";
import {useLoginMutation} from "@/api/axios-client/AuthQuery.ts";
import {useAuth} from "@/app/providers/AuthProvider.tsx";
import {Link, useNavigate} from "react-router-dom";
import {getRouteMain, getRouteRegister} from "@/shared/const/router.ts";

const LoginPage = () => {

    const [data, setData] = useState<LoginDto>({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const {message} = App.useApp();
    const {signIn} = useAuth();
    const navigate = useNavigate();

    const {mutate: login, isPending} = useLoginMutation({
        onSuccess: (data) => {
            message.success("Вы успешно вошли в систему");
            signIn(data.accessToken, data.refreshToken, rememberMe);
            navigate(getRouteMain(), {replace: true});
        },
        onError: () => {
            message.error("Неверный email или пароль");
        }
    });

    const onSubmit = () => {
        if (!data.email || !data.password) {
            message.info("Пожалуйста, введите ваш email и пароль");
            return;
        }
        login(data);
    }

    return (
        <div
            className={"h-screen w-screen bg-cover bg-center flex flex-col items-center lg:items-end justify-center lg:pr-48"}
            style={{backgroundImage: "url(/assets/login.jpg)"}}
        >
            <div className={"bg-white p-16 pb-24 rounded-xl max-w-[500px] w-full flex flex-col shadow-xl"}>
                <Typography.Text className={"text-3xl font-bold"}>
                    TSU.Plan
                </Typography.Text>
                <Typography.Text className={"text-2xl"}>
                    Добро пожаловать в систему
                </Typography.Text>
                <form className={"mt-12 flex flex-col"}>
                    <Typography.Text className={"text-lg"}>Почта</Typography.Text>
                    <Input size={"large"} className={"mb-2"} value={data.email} disabled={isPending}
                           onChange={(event) => setData({...data, email: event.target.value})}/>
                    <Typography.Text className={"text-lg"}>Пароль</Typography.Text>
                    <Input.Password size={"large"} value={data.password} disabled={isPending}
                                    onChange={(event) => setData({...data, password: event.target.value})}/>
                    <Checkbox className={"mt-2"} checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}>
                        Запомнить меня</Checkbox>
                    <Button
                        type={"primary"}
                        className={"w-full mt-8"}
                        shape={"round"}
                        size={"large"}
                        loading={isPending}
                        onClick={onSubmit}
                    >Войти</Button>
                    <Typography.Text className={"text-sm text-center text-stone-400 mt-2"}>
                        Нет аккаунта? <Link to={getRouteRegister()} className={"text-sm"}>Зарегистрироваться</Link>
                    </Typography.Text>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;