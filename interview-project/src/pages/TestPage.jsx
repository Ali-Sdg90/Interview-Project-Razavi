import React, { useContext, useEffect, useState } from "react";
import { Tree } from "antd";
import { getRequest } from "../services/apiService";
import { CommonContext } from "../store/CommonContextProvider";

const TestPage = () => {
    const [mainItems, setMainItems] = useState([]);

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
                    `/GetRootWithChildren`,
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
                `/GetChildrenByParentId?id=${treeNode.key}`,
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

    return (
        <Tree
            checkable
            defaultExpandAll
            treeData={mainItems}
            onCheck={onCheck}
            showLine
            loadData={onLoadData}
        />
    );
};

export default TestPage;
