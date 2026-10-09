/**
 * Chase ITIN — Surge HTTP request script
 * 根据《Chase Account Setup with ITIN》附件更新（2026-10-09）。
 * 与附件一致：body.replace('ssn', 'tin')，只替换首个小写 ssn。
 * 仅用于指定的在线账户注册接口；不代表 Chase 当前一定接受 ITIN。
 * 不输出请求体、账户号码或税务识别号。
 */
(function () {
    const pattern = /^https:\/\/secure\.chase\.com\/svc\/wl\/auth\/public\/v4\/user\/enrollment\/form\/list(?:\?.*)?$/;
    if (!pattern.test($request.url) || typeof $request.body !== "string" || !$request.body) {
        $done({});
        return;
    }

    const modified = $request.body.replace("ssn", "tin");
    if (modified === $request.body) {
        console.log("[Chase ITIN] 未找到 ssn，请求未修改。");
        $done({});
        return;
    }

    console.log("[Chase ITIN] 已将首个 ssn 替换为 tin。");
    $done({ body: modified });
})();
