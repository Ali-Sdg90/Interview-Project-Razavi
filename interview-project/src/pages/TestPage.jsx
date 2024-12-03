import React, { useContext, useEffect, useState } from "react";
import { Button, Col, ConfigProvider, Form, Input, Row, Tree } from "antd";
import {
    deleteRequest,
    getRequest,
    postRequest,
    putRequest,
} from "../services/apiService";
import { CommonContext } from "../store/CommonContextProvider";

const TestPage = () => {
    const [mainItems, setMainItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState();

    const { setToastifyObj } = useContext(CommonContext);

    const onCheck = (checkedKeys) => {
        console.log("Checked Keys:", checkedKeys);
    };

    const transformDataToTree = (data) => {
        const dataArray = Array.isArray(data) ? data : [data];

        return dataArray.map((item) => ({
            title: item.Title.trim(),
            key: item.Id,
            children:
                item.Children && item.Children.length > 0
                    ? transformDataToTree(item.Children)
                    : [],
        }));
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getRequest(
                    `/Department/GetRootWithChildren`,
                    false,
                    setToastifyObj
                );

                console.log("RES >>", res);

                if (res.IsSuccess) {
                    const transformedData = transformDataToTree(res.Data);
                    setMainItems(transformedData);
                } else {
                    throw new Error();
                }
            } catch (error) {
                console.log("Error in root >>", error.message);
            }
        };

        getData();
    }, []);

    const updateTreeData = (list, key, children) =>
        list.map((node) => {
            if (node.key === key) {
                return { ...node, children };
            }

            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }

            return node;
        });

    const onLoadData = async (treeNode) => {
        console.log(treeNode.key);

        if (treeNode.retry) {
            console.log("Noe");
        }
        try {
            const res = await getRequest(
                `/Department/GetChildrenByParentId?id=${treeNode.key}`,
                false,
                setToastifyObj
            );

            console.log("RES >>", res);

            if (res.IsSuccess) {
                const newChild = transformDataToTree(res.Data);

                setMainItems((prevState) =>
                    updateTreeData(prevState, treeNode.key, newChild)
                );
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log("Unsuccessful fetch child >>", error.message);
        }
    };

    const modifyItems = async (mode, values) => {
        console.log("values >>", values);

        debugger;

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
                const transformedData = transformDataToTree(res.Data);
                setMainItems(transformedData);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log("Error in PUT >>", error.message);
        }
    };

    const onSelect = (selectedKeys, { selected, node }) => {
        if (selected) {
            console.log("Selected Node:", node);

            setSelectedItemId(node.key);
        } else {
            console.log("Deselected Node");
            setSelectedItemId("");
        }
    };

    return (
        <Row>
            <Col span={12}>
                <Tree
                    checkable
                    defaultExpandAll
                    treeData={mainItems}
                    onCheck={onCheck}
                    showLine
                    loadData={onLoadData}
                    onSelect={onSelect}
                />
            </Col>

            <Col span={12}>
                {selectedItemId ? (
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
                            <Form.Item
                                label="Edit Current Item"
                                name="editValue"
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
                            onFinish={(values) => modifyItems("POST", values)}
                            layout="vertical"
                            initialValues={{
                                newValue: "hi",
                            }}
                        >
                            <Form.Item label="Add New Child" name="newValue">
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
                            <Form.Item label="Delete Item">
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                ) : (
                    <h3>Please select an Item to show its actions</h3>
                )}
            </Col>
        </Row>
    );
};

export default TestPage;
