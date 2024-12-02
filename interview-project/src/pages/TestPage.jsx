import React, { useContext, useEffect, useState } from "react";
import { Tree } from "antd";
import { getRequest } from "../services/apiService";
import { CommonContext } from "../store/CommonContextProvider";

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

const TestPage = () => {
    const [mainItems, setMainItems] = useState([]);
    const { setToastifyObj } = useContext(CommonContext);

    const onCheck = (checkedKeys) => {
        console.log("Checked Keys:", checkedKeys);
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
                    throw new Error("Unsuccessful fetch /GetRootWithChildren");
                }
            } catch (error) {
                console.log("Error in GetRootWithChildren-getData: ", error);
            }
        };

        getData();
    }, []);

    return (
        <Tree
            checkable
            defaultExpandAll
            treeData={mainItems}
            onCheck={onCheck}
            showLine
            // loadData={true}
        />
    );
};

export default TestPage;
