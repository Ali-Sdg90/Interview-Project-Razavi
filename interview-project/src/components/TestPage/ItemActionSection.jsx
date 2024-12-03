import React, { useContext } from "react";
import { Button, Form, Input } from "antd";
import {
    deleteRequest,
    postRequest,
    putRequest,
} from "../../services/apiService";
import { CommonContext } from "../../store/CommonContextProvider";

const ItemActionSection = ({ selectedItemId, setGetFreshData }) => {
    const { setToastifyObj } = useContext(CommonContext);

    const modifyItems = async (mode, values) => {
        try {
            let res;

            switch (mode) {
                case "PUT":
                    res = await putRequest(
                        `/Department`,
                        {
                            Id: selectedItemId,
                            Title: values.editValue,
                        },
                        false,
                        setToastifyObj
                    );
                    break;
                case "POST":
                    res = await postRequest(
                        `/Department`,
                        {
                            Title: values.newValue,
                            ParentId: selectedItemId,
                        },
                        false,
                        setToastifyObj
                    );
                    break;
                case "DELETE":
                    res = await deleteRequest(
                        `/Department?id=${selectedItemId}`,
                        false,
                        setToastifyObj
                    );
                    break;
                default:
                    break;
            }

            console.log("RES >>", res);

            if (res.IsSuccess) {
                setToastifyObj({
                    title: "Action applied successfully",
                    mode: "success",
                });

                setGetFreshData(true);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log("Error in Actions >>", error.message);
        }
    };

    return (
        <>
            <h3>Selected Item Id: {selectedItemId}</h3>

            <Form
                className="form-with-border"
                onFinish={(values) => modifyItems("PUT", values)}
                layout="vertical"
                initialValues={{
                    editValue: "hi",
                }}
            >
                <Form.Item label="Edit Selected Item Name" name="editValue">
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            <Form
                className="form-with-border"
                onFinish={(values) => modifyItems("POST", values)}
                layout="vertical"
                initialValues={{
                    newValue: "hi",
                }}
            >
                <Form.Item
                    label="Add New Child to Selected Item"
                    name="newValue"
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            <Form
                className="form-with-border"
                onFinish={(values) => modifyItems("DELETE", values)}
                layout="vertical"
            >
                <Form.Item label="Delete Selected Item">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ItemActionSection;
