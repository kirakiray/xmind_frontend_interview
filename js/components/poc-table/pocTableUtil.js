// td具体转换模块
define(() => {

    const categoryMap = new Map();

    return {
        // 初始化Category的方法
        initCategory(category) {
            // 获取分支
            let groups = category.split(/\n/g);

            groups.forEach((e, g_id) => {
                if (g_id == 0) {
                    return;
                }

                let gData = e.split(/,/g);

                if (categoryMap.has(gData[0])) {
                    throw {
                        desc: "category ID 已存在",
                        id: gData[0]
                    };
                }

                categoryMap.set(gData[0], {
                    id: gData[0],
                    type: gData[1],
                    name: gData[2]
                });
            });
        },
        // poc-td 转换文本的方法
        pocTrans: (text, type) => {
            let valueText = text;

            switch (type) {
                case "TYPE":
                    if (text == 0) {
                        valueText = "收入";
                    } else if (text == 1) {
                        valueText = "支出";
                    }
                    break;
                case "TIME":
                    valueText = new Date(parseInt(text)).toLocaleString();
                    break;
                case "CATEGORY":
                    let categoryData = categoryMap.get(text);
                    if (categoryData) {
                        valueText = categoryData.name + `(${categoryData.type == 1 ? '支出' : '收入'})`;
                    } else {
                        valueText = "不明分类";
                        console.warn("不明分类ID =>", text);
                    }
                    break;
                case "AMOUNT":
                    break;
            }

            return valueText;
        }
    };
});