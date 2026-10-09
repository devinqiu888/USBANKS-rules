# USBANKS-rules

这份规则集帮助 Surge 用户把美国银行和信用卡相关流量集中管理，并按自己的网络环境交给合适的策略组处理。你可以单独设置银行策略，避免银行流量与日常代理流量混在一起。

## 文件与 Raw 链接

| 文件 | 主要作用 | Raw 链接 |
| --- | --- | --- |
| [`allinone.list`](./allinone.list) | 美国银行及信用卡相关域名的 Surge 分流规则集，将匹配流量交给指定策略组处理。 | [获取规则集](https://raw.githubusercontent.com/devinqiu888/USBANKS-rules/main/allinone.list) |
| [`chase-itin.sgmodule`](./chase-itin.sgmodule) | Chase ITIN Surge 模块，用于实现下方网站攻略中的在线账户注册请求修改功能。安装模块即可加载配套脚本，无需单独安装脚本。 | [安装模块](https://raw.githubusercontent.com/devinqiu888/USBANKS-rules/main/chase-itin.sgmodule) |

## 覆盖范围

`allinone.list` 目前包括：

- **主要信用卡发卡行**：American Express、Bank of America、Barclays US、Capital One、Chase、Citi、Discover、FNBO、Synchrony、U.S. Bank 和 Wells Fargo。
- **其他常见卡项目或持卡人服务**：Bilt、Fidelity/Elan 和 SoFi。
- **信用与身份辅助服务**：Credit Karma、Experian、Equifax、TransUnion、AnnualCreditReport、myFICO 和 Veriff。
- **通用依赖**：反欺诈、监测、消息推送、调查及其他文件中列出的服务域名。

规则按机构和服务分组，包含常见美国信用卡发卡行、部分卡项目、信用报告机构，以及银行 App 可能使用的身份验证和辅助服务域名。规则使用 Surge 的 `DOMAIN` 和 `DOMAIN-SUFFIX` 类型。

## 在 Surge 中使用

### 1. 建立银行策略组

在 Surge 配置的 `[Proxy Group]` 中建立一个专门处理银行流量的策略组。下面的 `DIRECT` 只是示例，请按你的网络环境选择策略：

```ini
[Proxy Group]
US-Banks = select, DIRECT, Proxy
```

这样可以在 Surge 中单独切换银行流量走直连还是指定代理。策略组中的名称（例如 `Proxy`）必须与配置里已有的策略或策略组名称一致。

### 2. 添加规则集

1. 在 Surge 配置的 `[Rule]` 段添加规则集引用：

   ```ini
   RULE-SET,https://raw.githubusercontent.com/devinqiu888/USBANKS-rules/main/allinone.list,US-Banks
   ```

规则集默认指向 `US-Banks` 策略组。你也可以直接把策略名改成 `DIRECT` 或配置中的其他策略组。

### 3. 放置规则并选择策略

把这条 `RULE-SET` 放在 `[Rule]` 中通用兜底规则之前。Surge 按规则顺序匹配；如果更早的规则已经匹配该请求，银行策略组就不会接管它。

配置完成后，在 Surge 的策略界面选择 `US-Banks`，即可统一切换本规则集中的银行流量策略。若只希望调整某一家机构，也可以把该机构对应的 `DOMAIN` / `DOMAIN-SUFFIX` 规则复制到 `[Rule]`，并指定其他策略组。

## Chase ITIN 模块（可选）

本模块用于在 Surge 中实现 [Chase Account Setup with ITIN 网站攻略](https://docs.google.com/document/d/e/2PACX-1vQSjogADeDop3WCkfjH7_pXXfakFn48jiF1Ed5uFVavuc0iprma8vdblTStrLcbLfgvq0E4U9v9UM1h/pub)中的请求修改功能，帮助使用本人 ITIN 尝试注册 Chase 在线账户。

在 Surge 的模块管理中添加并启用以下链接：

```text
https://raw.githubusercontent.com/devinqiu888/USBANKS-rules/main/chase-itin.sgmodule
```

启用 Surge MITM，并安装、信任其 CA 证书后，按网站攻略在浏览器中操作即可。模块会自动加载配套脚本，无需单独安装 `chase-itin.js`。完成操作后可停用模块。

## 使用提示

银行网站和 App 还可能调用第三方验证或内容服务，个别流量不一定能仅凭银行主域名识别。若发现某个请求没有命中 `US-Banks`，可以在 Surge 请求日志中查看域名，并据此将该域名加入单独规则。规则只负责选择流量策略，不会改变银行账户资格、验证结果或服务内容。

## 免责声明

- 本仓库为个人维护的网络规则与请求修改示例，与 Chase、其他银行、信用机构及 Surge 官方无隶属、合作或背书关系；内容不构成金融、税务或法律意见。
- 分流规则只决定匹配流量使用哪项网络策略，不保证域名覆盖完整、连接可用或账户服务正常。部分通用域名也被其他网站或 App 使用，可能使非银行流量命中同一策略；请按自己的需要审阅和调整。
- Chase 模块通过配套脚本修改指定注册接口的请求，不生成或验证 ITIN，不改变开户资格，也不免除银行的身份核验要求。仅应使用本人真实、合法且符合银行要求的信息，不得用于冒用身份、提交虚假资料或规避验证。
- 接口路径、请求格式和银行处理规则可能变化。当前模块依据所参考攻略编写，未验证 Chase 当前接口或实际注册结果；替换发生不代表注册成功。
- MITM 会让 Surge 解密所配置主机的 HTTPS 流量，可能涉及账户号码、税务识别号等敏感信息。请自行审阅脚本，只使用可信设备及证书，避免分享完整请求、日志或截图，并在完成操作后停用不再需要的模块和 MITM 配置。当前脚本不主动发送额外网络请求，也不记录请求体、账户号码或 ITIN。
- 请遵守适用法律及相关服务条款，自行评估使用风险。作者不对规则或脚本的准确性、持续可用性及使用结果作保证；在适用法律允许的范围内，不承担因使用本仓库内容造成的损失。
