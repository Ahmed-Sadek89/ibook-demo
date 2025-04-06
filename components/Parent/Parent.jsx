"use client"
import Grid from '@mui/material/Grid2';
import Container from "@mui/system/Container";
import cls from "./parent.module.scss";
import Navbar from "../Navbar/Navbar";
import ParentInfo from "./parent-info";
import ParentChildsList from "./parent-childs-list";

const Parent = ({ canAddData, parentData }) => {
    return (
        <div className={cls.parent}>
            <Navbar />
            <h2>لوحة تحكم أولياء الأمور</h2>
            <Container>
                <Grid container spacing={2} className={cls.cardsWrapper}>
                    <ParentInfo canAddData={canAddData} />
                    <ParentChildsList parentData={parentData} />
                </Grid>
            </Container>
        </div>
    )
}

export default Parent
