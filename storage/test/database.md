# 表结构

>已过时内容, 仅供参考

## 用户表

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    nickname VARCHAR(64) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(512)
);
```

## 文章表

> 禁止`slug`使用uuid格式(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)!  
> 前端和后端都要校验

```sql
CREATE TABLE articles (
    uuid CHAR(36) PRIMARY KEY,
    slug VARCHAR(128) NOT NULL UNIQUE,
    title VARCHAR(128) NOT NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

## 资源表
```sql
CREATE TABLE resources (
    name_hash CHAR(12) PRIMARY KEY,
    name_origin VARCHAR(255) NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    file_size BIGINT UNSIGNED NOT NULL,
    article_uuid CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (article_uuid) REFERENCES articles(uuid) ON DELETE CASCADE,
    INDEX idx_article (article_uuid)
);
```

## 标签表
```sql
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_zh VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL
);
```

## 文章-标签 关联表
```sql
CREATE TABLE article_tags (
    article_uuid CHAR(36) NOT NULL,
    tag_id INT NOT NULL,

    PRIMARY KEY (article_uuid, tag_id)
    FOREIGN KEY (article_uuid) REFERENCES articles(uuid) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```