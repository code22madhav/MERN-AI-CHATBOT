import { useEffect, useState, useRef } from "react";
interface CountDownProps {
  setCanResend: React.Dispatch<React.SetStateAction<boolean>>;
  timerKey: number;
}
function CountDown({setCanResend, timerKey}:CountDownProps){
    const [totalSec, setTotalSec]=useState<number>(299);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setCanResend(false);
        setTotalSec(299); // reset time

        intervalRef.current = setInterval(() => {
            setTotalSec(prev => {
            if (prev <= 1) {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                setCanResend(true);
                return 0;
            }
            return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
            clearInterval(intervalRef.current);
            }
        };
    }, [timerKey]);

    return(<>
        {`${Math.floor(totalSec/60)} : ${totalSec%60}`}
    </>)
}

export default CountDown;