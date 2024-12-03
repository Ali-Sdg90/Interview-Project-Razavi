import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Tree } from "antd";

import { getRequest } from "../services/apiService";
import { CommonContext } from "../store/CommonContextProvider";

import ItemActionSection from "../components/TestPage/ItemActionSection";

const TestPage = () => {
    const [mainItems, setMainItems] = useState([]);
    const [selectedItemNode, setSelectedItemNode] = useState();
    const [getFreshData, setGetFreshData] = useState(true);

    const { setToastifyObj } = useContext(CommonContext);

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
        const getRootData = async () => {
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

        if (getFreshData) {
            console.log(getFreshData);

            setGetFreshData(false);
            getRootData();
        }
    }, [getFreshData]);

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

    const onSelect = (selectedKeys, { selected, node }) => {
        console.log(node);
        if (selected) {
            setSelectedItemNode(node);
        } else {
            setSelectedItemNode("");
        }
    };

    return (
        <Row>
            <Col span={12}>
                <Tree
                    className="tree-section"
                    checkable
                    defaultExpandAll
                    treeData={mainItems}
                    showLine
                    loadData={onLoadData}
                    onSelect={onSelect}
                />
            </Col>

            <Col span={12}>
                {selectedItemNode ? (
                    <ItemActionSection
                        selectedItemNode={selectedItemNode}
                        setGetFreshData={setGetFreshData}
                    />
                ) : (
                    <h3>Please select an Item to show its actions</h3>
                )}
            </Col>
        </Row>
    );
};

export default TestPage;
