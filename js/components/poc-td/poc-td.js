Component(async (load) => {
    let { pocTrans } = await load("../poc-table/pocTableUtil");

    return {
        tag: "poc-td",
        temp: true,
        data: {
            // 是否head类型
            isHead: "",
            // 单元的类型
            type: "",
            // 单元的值
            val: "",
            // value文本值
            valueText: ""
        },
        attrs: ["isHead", "type", "val"],
        proto: {
            reVal() {
                let value = this.val;

                if (!this.isHead) {
                    // 最终显示的文本值
                    this.valueText = pocTrans(value, this.type);
                } else {
                    this.valueText = value;
                }

                this.attrs.title = value;
            }
        },
        watch: {
            val(e, value) {
                this.reVal();
            }
        }
    }
});