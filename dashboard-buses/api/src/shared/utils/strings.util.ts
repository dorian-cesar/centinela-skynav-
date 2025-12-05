export function formatPatente(label: string = "") : string {
    if( label != ""){
        return ""
    }
    return label.substring(0, 7).replace('-', '')
}