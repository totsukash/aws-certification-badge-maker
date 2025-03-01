# aws-certification-badge-maker

### Top

https://aws-badge-maker.vercel.app/

### Githubへの組み込み

以下のHTMLをREADME.mdに埋め込むことで、Github上でバッジを表示できます。
`certs`パラメータにAWS認定資格の略称をカンマ区切りで指定してください。

| 資格略称 | 認定資格名                               | レベル          |
|------|-------------------------------------|--------------|
| AIF  | AI Practitioner                     | Foundational |
| CLF  | Cloud Practitioner                  | Foundational |
| SOA  | SysOps Administrator Associate      | Associate    |
| DEA  | Data Engineer Associate             | Associate    |
| MLA  | Machine Learning Engineer Associate | Associate    |
| DVA  | Developer Associate                 | Associate    |
| SAP  | Solutions Architect Professional    | Professional |
| DOP  | DevOps Engineer Professional        | Professional |
| SAA  | Solutions Architect Associate       | Associate    |
| ANS  | Advanced Networking Specialty       | Specialty    |
| MLS  | Machine Learning Specialty          | Specialty    |
| SCS  | Security - Specialty                | Specialty    |

URL例:

```
https://badge-studio.vercel.app/api/aws?certs=DEA,CLF
```

Githubに埋め込む例:

```html
<img src="https://badge-studio.vercel.app/api/aws?certs=DEA,CLF" width="800" height="250" alt="AWS Certifications">
```

<img src="https://badge-studio.vercel.app/api/aws?certs=DEA,CLF" width="800" height="250" alt="AWS Certifications">

