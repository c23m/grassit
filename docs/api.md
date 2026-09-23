# FastAPI

> Version 0.1.0


## Path Table

| Method | Path                                                     | Description    |
| ------ | -------------------------------------------------------- | -------------- |
| GET    | [/api/test](#getapitest)                                 | Read Test      |
| POST   | [/api/auth/login](#postapiauthlogin)                     | Login          |
| GET    | [/api/auth/logout](#getapiauthlogout)                    | Logout         |
| POST   | [/api/auth/register](#postapiauthregister)               | Register       |
| GET    | [/api/auth/me](#getapiauthme)                            | Me             |
| POST   | [/api/auth/refresh](#postapiauthrefresh)                 | Refresh        |
| GET    | [/api/user/{username}](#getapiuserusername)              | Get User       |
| DELETE | [/api/user/{username}](#deleteapiuserusername)           | Delete User    |
| GET    | [/api/article](#getapiarticle)                           | List Articles  |
| POST   | [/api/article](#postapiarticle)                          | Create Article |
| GET    | [/api/article/{identifier}](#getapiarticleidentifier)    | Get Article    |
| DELETE | [/api/article/{identifier}](#deleteapiarticleidentifier) | Delete Article |

## Reference Table

| Name                | Path                                                                              | Description |
| ------------------- | --------------------------------------------------------------------------------- | ----------- |
| HTTPValidationError | [#/components/schemas/HTTPValidationError](#componentsschemashttpvalidationerror) |             |
| ValidationError     | [#/components/schemas/ValidationError](#componentsschemasvalidationerror)         |             |

## Path Details

***

### [GET]/api/test

- Summary  
Read Test

- Operation id  
read_test_api_test_get

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

***

### [POST]/api/auth/login

- Summary  
Login

- Operation id  
login_api_auth_login_post

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

***

### [GET]/api/auth/logout

- Summary  
Logout

- Operation id  
logout_api_auth_logout_get

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

***

### [POST]/api/auth/register

- Summary  
Register

- Operation id  
register_api_auth_register_post

#### Responses

- 201 Successful Response

`application/json`

```typescript
```

***

### [GET]/api/auth/me

- Summary  
Me

- Operation id  
me_api_auth_me_get

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

***

### [POST]/api/auth/refresh

- Summary  
Refresh

- Operation id  
refresh_api_auth_refresh_post

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

***

### [GET]/api/user/{username}

- Summary  
Get User

- Operation id  
get_user_api_user__username__get

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

- 422 Validation Error

`application/json`

```typescript
{
  detail: {
    loc?: Partial(string) & Partial(integer)[]
    msg: string
    type: string
    ctx: {
    }
  }[]
}
```

***

### [DELETE]/api/user/{username}

- Summary  
Delete User

- Operation id  
delete_user_api_user__username__delete

#### Responses

- 204 Successful Response

- 422 Validation Error

`application/json`

```typescript
{
  detail: {
    loc?: Partial(string) & Partial(integer)[]
    msg: string
    type: string
    ctx: {
    }
  }[]
}
```

***

### [GET]/api/article

- Summary  
List Articles

- Operation id  
list_articles_api_article_get

#### Parameters(Query)

```typescript
// 鐢ㄦ埛鍚?author?: Partial(string) & Partial(null)
```

```typescript
// 鏍囬鍖呭惈鐨勫瓧绗︿覆
title?: Partial(string) & Partial(null)
```

```typescript
// slug 鍖呭惈鐨勫瓧绗︿覆
slug?: Partial(string) & Partial(null)
```

```typescript
// 鍒涘缓鏃堕棿 >= start
start?: Partial(string) & Partial(null)
```

```typescript
// 鍒涘缓鏃堕棿 <= end
end?: Partial(string) & Partial(null)
```

```typescript
// 鏍囩锛屽涓彇浜ら泦
tags?: Partial(string[]) & Partial(null)
```

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

- 422 Validation Error

`application/json`

```typescript
{
  detail: {
    loc?: Partial(string) & Partial(integer)[]
    msg: string
    type: string
    ctx: {
    }
  }[]
}
```

***

### [POST]/api/article

- Summary  
Create Article

- Operation id  
create_article_api_article_post

#### Responses

- 201 Successful Response

`application/json`

```typescript
```

***

### [GET]/api/article/{identifier}

- Summary  
Get Article

- Operation id  
get_article_api_article__identifier__get

#### Responses

- 200 Successful Response

`application/json`

```typescript
```

- 422 Validation Error

`application/json`

```typescript
{
  detail: {
    loc?: Partial(string) & Partial(integer)[]
    msg: string
    type: string
    ctx: {
    }
  }[]
}
```

***

### [DELETE]/api/article/{identifier}

- Summary  
Delete Article

- Operation id  
delete_article_api_article__identifier__delete

#### Responses

- 204 Successful Response

- 422 Validation Error

`application/json`

```typescript
{
  detail: {
    loc?: Partial(string) & Partial(integer)[]
    msg: string
    type: string
    ctx: {
    }
  }[]
}
```

## References

### #/components/schemas/HTTPValidationError

```typescript
{
  detail: {
    loc?: Partial(string) & Partial(integer)[]
    msg: string
    type: string
    ctx: {
    }
  }[]
}
```

### #/components/schemas/ValidationError

```typescript
{
  loc?: Partial(string) & Partial(integer)[]
  msg: string
  type: string
  ctx: {
  }
}
```
