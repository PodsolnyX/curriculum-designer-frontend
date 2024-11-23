import AppRouter from "@/app/providers/router/AppRouter.tsx";
import {useInstanceInterceptors} from "@/shared/lib/hooks/useInstanceInterceptors.ts";

function App() {

    useInstanceInterceptors();

    return (
        <AppRouter/>
    );
}

export default App;
