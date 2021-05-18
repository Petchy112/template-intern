export default (host: string, path: string): string => {
    return 'https' + '://' + host + '/api/media/email/image/' + path
}
