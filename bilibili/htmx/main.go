// bili-htmx — B 站首页静态快照 → Go + HTMX 重建 demo
// 端口 8081；8080 静态版留作对照
// UI 100% 复现：DOM/CSS 原样保留（BEM 类名 + 原版 bili.css），仅数据区模板化
package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"text/template"
)

//go:embed templates static data
var content embed.FS

// Card — 视频卡片数据（从静态快照提取）
type Card struct {
	Cover string `json:"cover"`
	Title string `json:"title"`
	Up    string `json:"up"`
	Play  string `json:"play"`
	Dur   string `json:"dur"`
	Href  string `json:"href"`
}

var (
	cards []Card
	tpls  *template.Template
)

func main() {
	// 数据
	raw, err := content.ReadFile("data/feed.json")
	if err != nil {
		log.Fatal("读 data/feed.json:", err)
	}
	if err := json.Unmarshal(raw, &cards); err != nil {
		log.Fatal("解析 feed.json:", err)
	}
	log.Printf("加载卡片 %d 条", len(cards))

	// 模板（文件名即模板名：layout.html / feed.html）
	// 用 text/template：原版 B 站 HTML 结构宽松，html/template 严格解析会报错
	tpls = template.Must(template.ParseFS(content, "templates/*.html"))

	// 路由
	http.HandleFunc("/", home)          // 整页
	http.HandleFunc("/api/feed", feed)  // HTMX 局部片段（换一批/频道）
	http.HandleFunc("/api/nav/dyn", navDyn)
	http.HandleFunc("/bili.css", serve("static/bili.css", "text/css; charset=utf-8"))
	http.HandleFunc("/override.css", serve("static/override.css", "text/css; charset=utf-8"))
	http.HandleFunc("/nav.css", serve("static/nav.css", "text/css; charset=utf-8"))
	http.HandleFunc("/htmx.min.js", serve("static/htmx.min.js", "application/javascript"))

	log.Println("B站 HTMX 版: http://localhost:8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}

// serve — embed 文件直出
func serve(path, ctype string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		b, err := content.ReadFile(path)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", ctype)
		w.Write(b)
	}
}

// pick — 取一批卡片（循环位移，page 不同 → 内容不同）
func pick(page int) []Card {
	n := len(cards)
	if n == 0 {
		return []Card{}
	}
	start := (page * 12) % n
	out := make([]Card, 0, 12)
	for i := 0; i < 12; i++ {
		out = append(out, cards[(start+i)%n])
	}
	return out
}

func home(w http.ResponseWriter, r *http.Request) {
	data := struct{ Cards []Card; Page int }{Cards: pick(0), Page: 0}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tpls.ExecuteTemplate(w, "layout.html", data); err != nil {
		log.Println("layout err:", err)
	}
}

func feed(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	data := struct{ Cards []Card; Page int }{Cards: pick(page), Page: page}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tpls.ExecuteTemplate(w, "feed-cards.html", data); err != nil {
		log.Println("feed err:", err)
	}
}

func navDyn(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, `<div style="font-size:14px"><div style="font-weight:600;margin-bottom:8px">动态（HC-HTML demo）</div><div style="color:#616a6d;line-height:22px">这里是语义化 hc-nav 的 HTMX 局部刷新面板。<br>点击"动态"→ 服务端返回本片段 → 替换面板内容。</div></div>`)
}

var _ = fmt.Sprintf
