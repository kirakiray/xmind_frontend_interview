ofa = async () => {
    // 读取默认文件
    let bill = await fetch("./bill.csv");
    let categories = await fetch("./categories.csv");
    let bill_text = await bill.text();
    let categories_text = await categories.text();

    ofa.config({
        baseUrl: "js/"
    });

    // 加载poc-table组件
    await load("components/poc-table -pack");

    // 使用专属方法添加导入csv
    $("poc-table")
        .importCategory(categories_text)
        .importCSV(bill_text);

    // 打开显示
    $("poc-table").display = "";
}