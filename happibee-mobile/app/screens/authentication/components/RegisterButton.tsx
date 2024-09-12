import { AuthOperationName, useEmailPasswordAuth } from "@realm/react";
import { Button } from "native-base";
import { useEffect } from "react";

type RegisterButtonProps = {
    email: string;
    password: string;
};

const RegisterButton = ({ email, password }: RegisterButtonProps) => {
    const { register, result, logIn } = useEmailPasswordAuth();

    useEffect(() => {
        if (result.success && result.operation === AuthOperationName.Register) {
            logIn({ email, password });
        }
    }, [result, logIn, email, password]);

    const performRegistration = () => {
        register({ email, password });
    };
    
    return (
        <Button onPress={performRegistration}>
            Registar
        </Button>
    );
};

export default RegisterButton;