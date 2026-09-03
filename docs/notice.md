# 注意事项

9/3

1. GET `/api/article/{identifier}`接口的返回, 不包含toc属性了. 也就是目录由前端处理.

2. 在0.2版本, 需要添加tag功能. 为此要添加2个额外的表:
    - tags 表
      - id: int(increment)
      - slug: String(varchar(64))
      - name: String(varchar(64))
    - article_tag 表
      - article_uuid
      - tag_id
      - PRIMARY KEY (article_uuid, tag_id)
      - FOREIGN KEY (article_uuid) REFERENCES articles(uuid) ON DELETE CASCADE,
      - FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE

3. 因此, 要在后面的