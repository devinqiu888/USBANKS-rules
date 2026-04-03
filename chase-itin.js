/**
 * Chase ITIN Fix - Surge Script
 * 
 * 用途：拦截 Chase 账户注册请求，将请求体中的 "ssn" 字段替换为 "tin"，
 *       使持有 ITIN（个人税务识别号）的用户能够在线完成 Chase 账户注册。
 * 
 * 触发 URL: https://secure.chase.com/svc/wl/auth/public/v4/user/enrollment/form/list
 * 
 * 原理说明：
 *   Chase 前端（网页/App）在发送注册表单时固定使用 "ssn" 字段名，
 *   但 Chase 后端实际上支持 "tin"（即 ITIN）字段。
 *   本脚本在请求发出前将请求体中的 "ssn" 替换为 "tin"，
 *   从而绕过前端限制，允许使用 ITIN 完成注册。
 */

const body = $request.body;

if (!body) {
    console.log("[Chase ITIN Fix] 请求体为空，跳过处理。");
    $done({});
} else {
    // 将请求体中所有的 "ssn" 替换为 "tin"（区分大小写）
    const modified = body.replace(/ssn/g, "tin");

    if (modified !== body) {
        console.log("[Chase ITIN Fix] ✅ 成功：已将请求体中的 'ssn' 替换为 'tin'。");
    } else {
        console.log("[Chase ITIN Fix] ⚠️ 未找到 'ssn' 字段，请求体未修改。");
    }

    $done({ body: modified });
}
