// td具体转换模块
define(() => {
    const categoryMap = new Map();

    return {
        // 初始化Category的方法
        initCategory(category) {
            category.forEach(e => {
                categoryMap.set(e.cid, {
                    id: e.cid,
                    type: e.ctype,
                    name: e.cname
                });
            });
        },
        // poc-td 转换文本的方法
        pocTrans: (text, type) => {
            let valueText = text;

            switch (type) {
                case "TYPE":
                    if (text == 0) {
                        valueText = "支出";
                    } else if (text == 1) {
                        valueText = "收入";
                    }
                    break;
                case "TIME":
                    valueText = new Date(parseInt(text)).toLocaleString();
                    break;
                case "CATEGORY":
                    let categoryData = categoryMap.get(text);
                    if (categoryData) {
                        valueText = categoryData.name + `(${categoryData.type == 1 ? '收入' : '支出'})`;
                    } else {
                        valueText = "不明分类";
                        console.warn("不明分类ID =>", text);
                    }
                    break;
                case "AMOUNT":
                    valueText = parseFloat(text).toFixed(2);
                    break;
            }

            return valueText;
        }
    };
});