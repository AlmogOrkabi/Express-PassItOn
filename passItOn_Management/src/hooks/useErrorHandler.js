import { useNavigate } from 'react-router-dom';

const useErrorHandler = () => {
    const navigate = useNavigate();

    const handleError = (error) => {
        if (error.status === 403) {
            alert('נותקת מהמערכת,נא התחבר/י שנית');
            navigate('/login');
        } else if (error.status === 500) {
            alert('שגיאה לא ידועה, נסה/י שנית');
        }
        else {
            console.error(error);
        }
    };

    return handleError;
};

export default useErrorHandler;