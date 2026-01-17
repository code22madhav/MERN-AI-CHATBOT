import { styled } from "styled-components";

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: fixed;
    inset: 0;
`;
export const Backdrop = styled.div`
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    position: fixed;
    inset: 0;
    z-index: 100;
`;
export const ModalBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 250px;
    padding: 20px;
    border-radius: 15px; 
    border: 1px solid black;
    justify-content: center;
    align-items: center;
    z-index: 101;
    background: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media (max-width: 600px) {
        width: 80%;
        padding: 20px 16px;
    }
`;