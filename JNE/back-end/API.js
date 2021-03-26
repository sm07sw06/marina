module.exports = {
    /**
     * Number, String, Array, Object 비어있는지 확인 
     * @param {*} value : String, Array, Object 넣기
     * @returns : 비어있으면 true 그렇치 않으면 false 반환
     */
    isEmpty(value) {
        if (value === null) return true
        if (value === 'null') return true
        if (typeof value === 'undefined') return true
        if (typeof value === 'string' && value === '') return true
        if (Array.isArray(value) && value.length < 1) return true
        if (typeof value === 'object' && value.constructor.name === 'Object' && Object.keys(value).length < 1 && Object.getOwnPropertyNames(value) < 1) return true
        if (typeof value === 'object' && value.constructor.name === 'String' && Object.keys(value).length < 1) return true // new String()

        return false
    },

    /**
     * 타입 확인
     * @param {*} target : 아무값이나 넣기
     * @returns : Number, String, Boolean, Object, Array, Function등 반환
     */
    getType(target) {
        return Object.prototype.toString.call(target).slice(8, -1);
    },

    /**
     * 함수가 아닌 모든 값 null로 초기화(Object 사용시 가능)
     * @param {*} objectData : Object 넣기
     */
    objectDefault(objectData){
        var data = Object.values(objectData);
        for(var i=0;i<data.length;i++)
            if(this.getType(data[i])!=="Function")
                objectData[Object.keys(objectData)[i]] = null;
    },
}