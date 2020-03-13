Component(async (load) => {
    return {
        tag: "left-pannel",
        temp: true,
        data: {
            // 排序类型
            sortType: "default",
            // 类型
            sType: "all",
            // 时间
            sTime: "all",
            // 类别
            sCate: "all",
            // 一下为表单属性
            fType: "",
            fTime: "",
            fCate: "",
            fAmount: ""
        },
        watch: {
            fType(e, fType) {
                if (fType === "") {
                    $.nextTick(e => this.$cateSelector.forEach(opt => opt.display = "none"))
                } else {
                    this.$cateSelector.forEach(opt => {
                        if (opt.data.type == fType) {
                            opt.display = "";
                        } else {
                            opt.display = "none";
                        }
                    });
                }

                this.fCate = "";
            }
        },
        proto: {
            // 添加月份时间
            importTime(timesData) {
                this.$monthEle.queAll('option:not([value="all"])').forEach(e => e.remove());
                timesData.forEach(e => {
                    this.$monthEle.push(`<option value="${e}">${e}</option>`);
                });
            },
            // 添加类别数据
            importCategory(categoryData) {
                categoryData.split(/\n/g).forEach((e, i) => {
                    if (i == 0) return;

                    let [cid, ctype, cname] = e.split(",");

                    this.$cateEle.push(`<option value="${cid}" data-type="${ctype}">${cname}</option>`);
                    this.$cateSelector.push(`<option value="${cid}" data-type="${ctype}">${cname}</option>`);
                });

                $.nextTick(() => {
                    this.fCate = "";
                });
            },
            // 添加新账单
            addItem() {
                let { fType, fTime, fCate, fAmount } = this;

                let tips = "";

                if (!fType) {
                    tips += ('账单类型不能为空\n');
                }

                if (!fTime) {
                    tips += ("请选择账单时间\n");
                }

                if (!fCate) {
                    tips += ("请选择账单类别\n");
                }

                if (!fAmount) {
                    tips += "请填写账单金额\n"
                }

                if (tips) {
                    alert(tips);
                    return;
                }

                this.emitHandler("addItem", { fType, fTime, fCate, fAmount });

                // 清空表单项
                Object.assign(this, {
                    fType: "", fTime: "", fCate: "", fAmount: ""
                });
            }
        }
    };
});