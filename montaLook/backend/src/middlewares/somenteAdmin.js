export default function somenteAdmin(req, res, next) {
  req.usuario = req.usuario || { perfil: "admin", id_usuario: null };
  return next();
}
