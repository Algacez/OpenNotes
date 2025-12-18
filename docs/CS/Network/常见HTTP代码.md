## 10x响应代码

- **100 Continue**：客户端应该要继续其请求
- **101 Switching Protocols**：服务器根据客户端的请求切换协议
- **102 Processing**（WebDAV）：服务器已接受请求，但尚未完成处理
- **103 Early Hints**：用于返回一些响应头信息，以便客户端在服务器准备响应的同时开始预加载资源。

## 20x响应代码

- **200 OK**：请求成功
- **201 Created**：请求成功且服务器创建了新的资源
- **202 Accepted**：服务器已接受请求，但尚未处理
- **203 Non-Authoritative Information**：服务器是一个转换代理服务器，所以返回的信息可能来自另一来源
- **204 No Content**：服务器成功处理了请求，但没有返回任何内容
- **205 Reset Content**：告诉客户端重置文档视图等，例如清空表单内容
- **206 Partial Content**：服务器成功处理了部分GET请求，用于HTTP分段下载

## 30x响应代码

- **300 Multiple Choices**：为这请求提供了多种选择
- **301 Moved Permanently**：请求的网页已永久移动到新位置（常用于永久重定向）
- **302 Found**：请求的网页临时移动到其他位置
- 303 See other :请求的响应可以在另一个URI上找到，并且客户端应使用GET方法从该URI检索响应
- **304 Not Modified**：自从上次请求后，请求的网页未修改过（常用于缓存）

## 40x响应代码

- **400 Bad Request**：服务器无法理解请求
- **401 Unauthorized**：请求要求用户的身份认证（用户未认证）
- **403 Forbidden**：服务器拒绝请求
- **404 Not Found**：服务器找不到请求的网页（非常常见）
- **405 Method Not Allowed**：请求行中指定的请求方法不能被用于请求相应的资源
- **406 Not Acceptable**：服务器无法根据客户端请求的内容特性完成请求
- **408 Request Timeout**：服务器等待客户端发送的请求时间过长，超时
- **409 Conflict**：请求与服务器当前状态冲突
- **410 Gone**：请求的资源已被永久删除
- **413 Payload Too Large**：请求实体过大，服务器无法处理
- **414 URI Too Long**：请求的URI过长，服务器无法处理
- **415 Unsupported Media Type**：请求的格式不被请求页面的服务器支持
- **416 Range Not Satisfiable**：客户端请求的范围无效或不可满足。
- **417 Expectation Failed**：服务器无法满足Expect请求头中指定的期望值。
- **429 Too Many Requests**：客户端在给定的时间内发送了太多请求

## 50x响应代码

- **500 Internal Server Error**：服务器遇到错误，无法完成请求（通用错误）
- **501 Not Implemented**：服务器不支持请求的功能，无法完成请求
- **502 Bad Gateway**：服务器作为网关或代理，从上游服务器收到无效响应
- **503 Service Unavailable**：服务器目前无法使用（由于超载或停机维护）
- **504 Gateway Timeout**：服务器作为网关或代理，但是没有及时从上游服务器收到请求
- **505 HTTP Version Not Supported**：服务器不支持请求中所用的HTTP协议版本
- **506 Variant Also Negotiates**：服务器有一个内部配置错误：对资源的直接请求会导致资源自身的一个不可解的死循环。
- **507 Insufficient Storage**（WebDAV）：服务器无法存储完成请求所必须的内容
- **508 Loop Detected**（WebDAV）：服务器在处理请求时检测到无限循环
- **510 Not Extended**：获取资源所需要的扩展没有被服务器满足。
- **511 Network Authentication Required**：客户端需要进行网络认证才能发起请求。