# Security Policy

## Security Best Practices

This project follows security best practices to protect against common web vulnerabilities.

### Implemented Security Measures

#### 1. Content Security Policy (CSP)

We implement a strict Content Security Policy to prevent XSS attacks:

- **Limited script sources**: Only allows scripts from trusted domains (self, giscus.app, analytics.umami.is)
- **Restricted image sources**: Images only from specific trusted domains and data URIs
- **Limited connections**: connect-src restricted to specific analytics and comment services
- **Frame protection**: Only giscus.app allowed for embedded frames

**Note**: CSP includes `'unsafe-inline'` and `'unsafe-eval'` which are required for:

- Next.js development features and hot module replacement
- Styled-jsx and Tailwind CSS runtime styles
- Consider using nonces or hashes in production for stricter CSP

#### 2. HTTP Security Headers

The following security headers are enforced:

- **Strict-Transport-Security**: Forces HTTPS with HSTS preload
- **X-Frame-Options**: Set to DENY to prevent clickjacking
- **X-Content-Type-Options**: Set to nosniff to prevent MIME type sniffing
- **Referrer-Policy**: Set to strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts access to device features (camera, microphone, geolocation)

#### 3. Dependency Security

- Regular dependency updates to patch known vulnerabilities
- All dependencies are monitored via `npm audit`
- Critical and high severity vulnerabilities are addressed immediately

#### 4. Environment Variables

- Sensitive configuration stored in environment variables
- `.env` files are gitignored to prevent accidental commits
- Never commit API keys, tokens, or secrets to version control

### Security Checklist for Contributors

When contributing to this project:

- [ ] Never commit `.env` files or secrets
- [ ] Run `npm audit` before submitting PRs
- [ ] Update dependencies to latest secure versions when possible
- [ ] Test CSP changes don't break functionality
- [ ] Review security headers if modifying `next.config.js`
- [ ] Validate user inputs properly
- [ ] Use parameterized queries for any database operations
- [ ] Sanitize any user-generated content before display

### Reporting Security Vulnerabilities

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Contact the repository owner directly via email (found in package.json)
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

### Dependencies with Security Considerations

The following packages require special attention:

- **Next.js**: Keep updated to latest patch version for security fixes
- **contentlayer2**: Monitor for updates as it processes markdown content
- **esbuild**: Required for build process, keep updated
- **pliny**: Provides analytics and comment integrations

### Regular Security Maintenance

Security is an ongoing process. This project:

1. Monitors for security advisories weekly
2. Updates dependencies monthly or when critical vulnerabilities are found
3. Reviews and updates CSP rules quarterly
4. Audits security headers annually

### Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)

## Version History

- **2024-12**: Initial security policy and CSP hardening
  - Updated all dependencies to fix 12 vulnerabilities
  - Strengthened CSP by restricting wildcard domains
  - Added HSTS preload directive
  - Documented security practices
