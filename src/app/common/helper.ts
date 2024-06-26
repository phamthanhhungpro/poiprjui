export function generateCodeFromName(name) {
    // Replace accented characters with their non-accented counterparts
    const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ";
    const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiioooooooooooooooouuuuuuuuuuuuyyyyyd";
    const mapping = {};

    for (let i = 0; i < from.length; i++) {
        mapping[from.charAt(i)] = to.charAt(i);
    }

    // Remove accents and convert to uppercase
    const str = name.split('').map(char => mapping[char] || char).join('');

    // Remove non-alphanumeric characters and convert to uppercase
    return str.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
};
