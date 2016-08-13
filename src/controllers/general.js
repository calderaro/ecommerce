
export function notFound (req, res, next){
	return res.status(404).json({ error: "Url not Found."});
}
