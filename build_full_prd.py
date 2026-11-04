import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def build_pixelmint_prd():
    doc = Document()

    # Page Setup
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("PixelMint — Product Requirements Document (PRD) v1.0")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        frun1 = fp.add_run("CONFIDENTIAL — PM PORTFOLIO PROJECT")
        frun1.font.name = "Calibri"
        frun1.font.size = Pt(8.5)
        frun1.font.color.rgb = RGBColor(148, 163, 184)
        frun2 = fp.add_run("\tProduct Management Portfolio Documentation")
        frun2.font.name = "Calibri"
        frun2.font.size = Pt(8.5)
        frun2.font.color.rgb = RGBColor(148, 163, 184)

    # Styling Helpers
    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=100, bottom=100, left=130, right=130):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'<w:top w:w="{top}" w:type="dxa"/>'
            f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
            f'<w:left w:w="{left}" w:type="dxa"/>'
            f'<w:right w:w="{right}" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        tcPr.append(tcMar)

    def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)

    def add_callout(title, text, bg_hex="F8FAFC", border_color="3B82F6"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=120, bottom=120, left=180, right=160)

        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        run_title = p.add_run(f"{title}: ")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(9.5)
        run_title.font.color.rgb = RGBColor(30, 41, 59)

        run_text = p.add_run(text)
        run_text.font.name = "Calibri"
        run_text.font.size = Pt(9.0)
        run_text.font.color.rgb = RGBColor(51, 65, 85)

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(0)
        p_spacer.paragraph_format.space_after = Pt(4)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(20)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(15)
        run.font.color.rgb = RGBColor(15, 23, 42)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(13)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(30, 41, 59)
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(10.5)
        run.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def add_body(text, bold_prefix=None, space_after=4):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(9.5)
            r_pre.font.color.rgb = RGBColor(30, 41, 59)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(9.5)
            r_pre.font.color.rgb = RGBColor(30, 41, 59)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def create_custom_table(headers, col_widths, rows_data):
        table = doc.add_table(rows=1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        set_table_borders(table)

        hdr_cells = table.rows[0].cells
        for i, h_text in enumerate(headers):
            hdr_cells[i].text = h_text
            set_cell_background(hdr_cells[i], "1E293B")
            set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9.0)
                r.font.bold = True
                r.font.color.rgb = RGBColor(255, 255, 255)

        trPr = table.rows[0]._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

        for r_idx, row_values in enumerate(rows_data):
            row_cells = table.add_row().cells
            bg_hex = "F8FAFC" if (r_idx % 2 == 1) else "FFFFFF"
            for c_idx, val in enumerate(row_values):
                row_cells[c_idx].text = str(val)
                set_cell_background(row_cells[c_idx], bg_hex)
                set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=110, right=110)
                p = row_cells[c_idx].paragraphs[0]
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.space_after = Pt(2)
                for r in p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(8.5)
                    r.font.color.rgb = RGBColor(51, 65, 85)

        for row in table.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)

        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_before = Pt(0)
        p_sp.paragraph_format.space_after = Pt(4)
        return table

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    p_cov_top = doc.add_paragraph()
    p_cov_top.paragraph_format.space_before = Pt(40)
    p_cov_top.paragraph_format.space_after = Pt(10)

    p_badge = doc.add_paragraph()
    p_badge.paragraph_format.space_after = Pt(14)
    r_badge = p_badge.add_run("PRODUCT MANAGEMENT PORTFOLIO ARTIFACT | CAPSTONE PROJECT")
    r_badge.font.name = "Calibri"
    r_badge.font.size = Pt(9.5)
    r_badge.font.bold = True
    r_badge.font.color.rgb = RGBColor(37, 99, 235)

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("PixelMint")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(32)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(18)
    r_sub = p_sub.add_run("Product Requirements Document (PRD) — Decentralized NFT Marketplace")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(15)
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    p_divider = doc.add_paragraph()
    p_divider.paragraph_format.space_after = Pt(28)
    r_div = p_divider.add_run("―" * 45)
    r_div.font.color.rgb = RGBColor(203, 213, 225)

    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.LEFT
    meta_table.autofit = False
    set_table_borders(meta_table, color="E2E8F0")

    metadata = [
        ("Project Name", "PixelMint (Web3 NFT Marketplace & Creator Studio)"),
        ("Prepared By", "[Author Name] — Aspiring Product Manager / Final-Year Student"),
        ("Document Version", "1.0 (Baseline Project & Feature Specification)"),
        ("Target Roles", "Associate Product Manager (APM) / PM Intern / Junior Product Manager"),
        ("Status", "Portfolio / Functional Front-End Prototype Documentation"),
        ("Date", "October 2026"),
    ]

    for idx, (label, val) in enumerate(metadata):
        c0 = meta_table.rows[idx].cells[0]
        c1 = meta_table.rows[idx].cells[1]
        c0.width = Inches(2.0)
        c1.width = Inches(4.5)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.name = "Calibri"
        r0.font.size = Pt(9.0)
        r0.font.color.rgb = RGBColor(71, 85, 105)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.name = "Calibri"
        r1.font.size = Pt(9.0)
        r1.font.color.rgb = RGBColor(15, 23, 42)

    p_abs_sp = doc.add_paragraph()
    p_abs_sp.paragraph_format.space_before = Pt(36)

    add_callout(
        "Document Purpose & Methodology",
        "This PRD was created as a capstone product management exercise based on the actual, working codebase of PixelMint. "
        "It treats the codebase as the sole source of truth. Every functional capability, mock simulation, and architectural gap is "
        "documented transparently without exaggerated corporate buzzwords or fabricated metrics. Its objective is to demonstrate fundamental "
        "product thinking: user problem framing, persona definition, user journeys, MVP scope rationalization, functional requirements, "
        "edge case identification, risk assessment, and the critical distinction between product design and engineering implementation.",
        bg_hex="EFF6FF",
        border_color="2563EB"
    )

    doc.add_page_break()

    # =========================================================================
    # TABLE OF CONTENTS / OUTLINE
    # =========================================================================
    add_h1("Table of Contents")
    toc_items = [
        ("1. Product Overview", "Context, problem space, user capabilities, and project origin"),
        ("2. Problem Statement", "Web3 onboarding complexity, opacity, gas fees, and problem classification"),
        ("3. Product Vision", "Vision statement and core guiding product principles"),
        ("4. Target Users & Personas", "Detailed profiles for Creator Elena, Collector Marcus, and Explorer Sophia"),
        ("5. User Problems and Needs", "Comprehensive mapping of pain points, user needs, and product responses"),
        ("6. Product Goals", "Five measurable and realistic product goals for PixelMint"),
        ("7. User Journeys", "Step-by-step user journey maps across key marketplace flows"),
        ("8. Product Scope", "Clear demarcation of In-Scope prototype features vs. Out-of-Scope future roadmap"),
        ("9. Feature Overview", "MoSCoW prioritized feature inventory with current implementation status"),
        ("10. MVP Definition", "Minimum Viable Product boundaries and component-by-component rationale"),
        ("11. Functional Requirements", "Formal specifications from FR-01 to FR-18 with priority and verification notes"),
        ("12. User Stories", "14 persona-aligned user stories following industry standard formatting"),
        ("13. Acceptance Criteria", "Explicit testable criteria across search, minting, wallet, checkout, and bidding"),
        ("14. Non-Functional Requirements", "Usability, performance, security communication, reliability, and error handling"),
        ("15. UX / UI Requirements", "Detailed breakdown of screens, layouts, component interactions, and modals"),
        ("16. Edge Cases and Error States", "10 realistic edge case scenarios with system responses"),
        ("17. Proposed Success Metrics", "Unmeasured product success framework spanning acquisition, conversion, and retention"),
        ("18. Risks and Mitigations", "Assessment of smart contract, wallet UX, fee volatility, and regulatory risks"),
        ("19. Assumptions", "Product, user, and technical assumptions underlying this specification"),
        ("20. Open Product Questions", "Strategic questions regarding Layer-2 networks, custody, and economics"),
        ("21. Future Opportunities", "AI-assisted NFT description generation and creator studio tooling"),
        ("22. Implementation Status Audit", "Brutally honest feature audit comparing expected behavior vs. codebase reality"),
        ("23. Product Roadmap", "Three-phase evolutionary roadmap from prototype to testnet and production"),
        ("24. Conclusion & PM Retrospective", "Personal learnings, trade-offs made, and portfolio summary"),
        ("25. Appendix", "Project architecture, repository structure, and Web3 terminology glossary"),
    ]

    toc_table = doc.add_table(rows=1, cols=2)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_table.autofit = False
    set_table_borders(toc_table, color="E2E8F0")

    toc_table.rows[0].cells[0].text = "Section"
    toc_table.rows[0].cells[1].text = "Summary of Contents"
    set_cell_background(toc_table.rows[0].cells[0], "1E293B")
    set_cell_background(toc_table.rows[0].cells[1], "1E293B")
    set_cell_margins(toc_table.rows[0].cells[0], top=80, bottom=80, left=100, right=100)
    set_cell_margins(toc_table.rows[0].cells[1], top=80, bottom=80, left=100, right=100)
    for c in toc_table.rows[0].cells:
        for r in c.paragraphs[0].runs:
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

    for idx, (sec_title, sec_desc) in enumerate(toc_items):
        r_cells = toc_table.add_row().cells
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        r_cells[0].text = sec_title
        r_cells[1].text = sec_desc
        set_cell_background(r_cells[0], bg)
        set_cell_background(r_cells[1], bg)
        set_cell_margins(r_cells[0], top=60, bottom=60, left=100, right=100)
        set_cell_margins(r_cells[1], top=60, bottom=60, left=100, right=100)
        
        p0 = r_cells[0].paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_after = Pt(1)
        r0 = p0.runs[0]
        r0.font.name = "Calibri"
        r0.font.size = Pt(8.5)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(30, 41, 59)

        p1 = r_cells[1].paragraphs[0]
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_after = Pt(1)
        r1 = p1.runs[0]
        r1.font.name = "Calibri"
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = RGBColor(71, 85, 105)

    for r in toc_table.rows:
        r.cells[0].width = Inches(2.4)
        r.cells[1].width = Inches(4.1)

    doc.add_page_break()

    # =========================================================================
    # 1. PRODUCT OVERVIEW
    # =========================================================================
    add_h1("1. Product Overview")
    add_body(
        "PixelMint is a decentralized digital art marketplace and creator studio prototype designed to simplify the discovery, "
        "minting, and trading of non-fungible tokens (NFTs). Built as a final-year university capstone project, PixelMint was conceived "
        "to explore how the complex, intimidating user journeys typical of early Web3 applications can be streamlined into intuitive, "
        "approachable consumer experiences."
    )
    add_body(
        "The project operates in the digital collectibles and creator economy problem space. Existing platforms such as OpenSea, LooksRare, "
        "and Magic Eden established the technical standard for decentralized asset exchange, but they often present significant usability "
        "barriers for non-technical users. Newcomers are routinely confronted with confusing terminology, multi-step signature requests, "
        "unpredictable network fees ('gas'), and fragmented creator tools. PixelMint seeks to lower these barriers by testing clearer user "
        "flows, transparent pricing summaries, and safe transactional simulation guardrails."
    )
    
    add_h2("1.1 Core Capabilities Built in PixelMint")
    add_body("Within the current functional application, users can perform the following key actions:")
    add_bullet("Discover Curated Artworks: Browse a catalog of 1-of-1 digital artworks categorized by Art, Collectibles, Photography, Music, Gaming, and Virtual Worlds.", bold_prefix="Catalog Discovery: ")
    add_bullet("Multi-Parametric Search & Filtering: Filter assets dynamically by search query, sale mechanism (Fixed Price vs. Timed Auction), price range slider (0–15 ETH), and verified creator status.", bold_prefix="Discovery Controls: ")
    add_bullet("Inspect Provenance & On-Chain Metadata: View item-level smart contract specifications, token standards (ERC-721), token IDs, creator royalty splits, trait rarity attributes, and full historical transaction logs.", bold_prefix="Token Provenance: ")
    add_bullet("Simulate Multi-Wallet Web3 Connection: Connect simulated provider interfaces (MetaMask, WalletConnect, Coinbase Wallet, Phantom, Rainbow) and toggle active network contexts across Ethereum, Polygon, Arbitrum, and Solana.", bold_prefix="Wallet Integration: ")
    add_bullet("Creator Studio & Minting: Upload custom artwork files (via file picker or drag-and-drop) or pick generative presets, define token attributes, configure secondary royalties (up to 20%), estimate gas costs, and deploy newly minted items into the active catalog.", bold_prefix="Self-Serve Minting: ")
    add_bullet("Instant Checkout & Atomic Purchase: Buy fixed-price assets with upfront item price + gas fee breakdowns, balance checks, simulated blockchain execution, ownership reassignment, and activity logging.", bold_prefix="Direct Buy: ")
    add_bullet("Live Timed Auction Bidding: Place competitive bids on auction-listed artworks with minimum increment validation (+0.1 ETH), balance checks, and bidder activity timelines.", bold_prefix="Auction Bidding: ")
    add_bullet("Make Direct Offers: Submit off-market purchase proposals with custom price amounts and expiration windows (1, 3, or 7 days) directly to asset owners.", bold_prefix="Offer Negotiation: ")
    add_bullet("Collector Portfolio Dashboard: Monitor collected assets, created drops, favorited items, net portfolio valuation in ETH, and an interactive transaction activity feed.", bold_prefix="Inventory Management: ")
    add_bullet("Integrated Test Faucet: Claim +5.0 simulated ETH with a single click to easily test buying and bidding flows without personal financial risk.", bold_prefix="Risk-Free Testing: ")

    add_h2("1.2 Project Origin & Context")
    add_body(
        "I chose to build PixelMint as my final-year project because the intersection of digital property rights, creator royalties, "
        "and consumer user experience represents one of the most challenging product design frontiers in modern software. Rather than building "
        "a generic web application, I wanted to tackle a domain where user anxiety and technical friction are genuinely high. Building the "
        "application hands-on allowed me to understand how state management, wallet signatures, on-chain metadata, and marketplace mechanics "
        "interact—and where consumer UX most frequently breaks down."
    )

    # =========================================================================
    # 2. PROBLEM STATEMENT
    # =========================================================================
    add_h1("2. Problem Statement")
    add_body(
        "While blockchain technology allows provable digital ownership and automated creator royalties, mainstream consumer adoption "
        "remains severely bottlenecked by user experience friction. Through competitive evaluation of established marketplaces and informal user "
        "walkthroughs with university peers, four core problem areas were identified:"
    )

    add_h2("2.1 Friction Areas Observed")
    add_bullet(
        "Conventional NFT platforms assume high technical literacy. First-time users are confronted with cryptic hexadecimal addresses, "
        "unexplained network switches, and opaque signature requests that resemble software errors rather than secure confirmations.",
        bold_prefix="1. High Web3 Onboarding & Cognitive Overhead: "
    )
    add_bullet(
        "Purchasing an asset on-chain involves unpredictable network gas fees that fluctuate by the second. Marketplaces frequently fail "
        "to display total costs upfront, causing users to initiate transactions only to suffer failures or pay unexpectedly high fees.",
        bold_prefix="2. Unpredictable Transaction Economics & Gas Anxiety: "
    )
    add_bullet(
        "Browsing large NFT marketplaces often feels overwhelming. Catalogs are polluted with spam collections, duplicate listings, "
        "and confusing filtering options, making it difficult for buyers to evaluate true item provenance, authenticity, and creator legitimacy.",
        bold_prefix="3. Cluttered Discovery & Poor Information Architecture: "
    )
    add_bullet(
        "For independent digital artists, converting image files into tokenized assets typically requires technical knowledge of IPFS storage, "
        "smart contract deployment, and royalty standards (ERC-2981). Non-technical creators need a straightforward guided flow.",
        bold_prefix="4. Intimidating Creator Workflows: "
    )

    add_h2("2.2 Problem Classification Matrix")
    add_body(
        "To maintain product integrity, the table below clearly distinguishes between what problems were observed, what solutions were "
        "actually built into the PixelMint prototype, and what challenges remain open for future engineering research."
    )

    prob_headers = ["Problem Area", "Observed Friction", "PixelMint Prototype Response", "Status / Implementation Reality"]
    prob_widths = [1.3, 1.8, 2.0, 1.4]
    prob_data = [
        [
            "Web3 Onboarding",
            "Users fear signing unknown wallet prompts or losing funds during wallet setup.",
            "Simulated multi-wallet modal with 1-click connection, test faucet (+5 ETH), and network switcher.",
            "Functional UI simulation. Does not invoke real external browser wallet extensions."
        ],
        [
            "Transaction Opacity",
            "Checkout screens hide gas fees, resulting in transaction failures due to balance shortfalls.",
            "Instant Checkout modal with explicit line-item breakdown (Asset Price + ~0.0035 ETH Gas + Royalty split = Total Cost).",
            "Fully implemented logic. Calculates balance sufficiency and updates local state."
        ],
        [
            "Gas Fee Reduction",
            "High Layer-1 Ethereum mainnet gas fees create barrier to entry for micro-transactions.",
            "Visual gas fee estimation (~0.012 ETH mint, ~0.0035 ETH buy) displayed upfront.",
            "Open Consideration. Gas reduction was an initial goal; no Layer-2 rollup or gasless contract is currently deployed."
        ],
        [
            "Creator Complexity",
            "Creators struggle with token metadata, trait schemas, and royalty definitions.",
            "Step-by-step Creator Studio with drag-and-drop upload, preset picker, royalty slider (0-20%), and custom trait builders.",
            "Fully functional client-side minting flow. Stores metadata in application state & localStorage."
        ],
        [
            "Security & Trust",
            "Pervasive fear of malicious contracts, phishing links, and unverified smart contracts.",
            "Clear provenance tabs showing Token ID, ERC-721 standard, verified artist badges, and historical logs.",
            "UI Prototype. '100% Audited' badge on landing page is a marketing placeholder; no formal audit was performed."
        ],
    ]
    create_custom_table(prob_headers, prob_widths, prob_data)

    add_callout(
        "Important Product Note on Gas Reduction & Security Audits",
        "As an aspiring Product Manager, I believe in complete transparency regarding product maturity. Gas fee reduction was an essential "
        "motivating problem for PixelMint, but a production Layer-2 or meta-transaction solution (e.g., EIP-2771 gasless relayer or Arbitrum rollups) "
        "was NOT built into this version. Similarly, no third-party security audits (e.g., OpenZeppelin or CertiK) were conducted. "
        "These remain documented engineering requirements for subsequent production phases.",
        bg_hex="FFFBEB",
        border_color="D97706"
    )

    # =========================================================================
    # 3. PRODUCT VISION
    # =========================================================================
    add_h1("3. Product Vision")
    add_body(
        "\"To create an accessible, clear, and transparent digital asset marketplace where creators can mint artworks and collectors can "
        "discover and trade NFTs without encountering unnecessary Web3 complexity or opaque transaction steps.\"",
        bold_prefix="Product Vision Statement: "
    )
    add_body(
        "PixelMint does not seek to reinvent the blockchain protocol layer; instead, it aims to humanize it. We envision a digital art ecosystem "
        "where independent visual artists can establish verifiable ownership of their work in under three minutes, and where collectors of all "
        "experience levels can transact with total confidence regarding total costs, provenance, and asset rights."
    )

    add_h2("3.1 Core Guiding Principles")
    add_bullet(
        "Every Web3 concept must have plain-language explanations. Avoid jargon like 'slippage tolerance' or 'calldata' in consumer interfaces. "
        "When an action requires a fee or signature, explain exactly what is happening in terms a first-time user can understand.",
        bold_prefix="1. Clarity Over Complexity: "
    )
    add_bullet(
        "No hidden expenses. All checkout and minting flows must display a complete line-item breakdown of asset price, network gas estimation, "
        "and creator royalties before the user initiates any confirmation.",
        bold_prefix="2. Transparent Economics: "
    )
    add_bullet(
        "Artists should never be forced to write code or configure backend servers to list their art. Token standard configurations, "
        "royalty split guarantees, and metadata attribute formatting must be accessible via intuitive form inputs.",
        bold_prefix="3. Creator Autonomy: "
    )
    add_bullet(
        "Provide interactive sandbox capabilities—such as our test balance faucet and simulated transaction engine—allowing users to explore "
        "and understand marketplace mechanics safely before risking real personal capital.",
        bold_prefix="4. Safe Exploration Guardrails: "
    )

    # =========================================================================
    # 4. TARGET USERS & PERSONAS
    # =========================================================================
    add_h1("4. Target Users & Persona Profiles")
    add_body(
        "PixelMint is designed around three primary user archetypes. Rather than relying on generic demographic generalizations, "
        "these personas focus on user goals, technical comfort levels, and behavioral pain points."
    )

    add_h2("4.1 Persona 1: Elena Vance — The Independent Digital Creator")
    add_bullet("Freelance digital illustrator and generative artist with 4 years of experience selling prints via Etsy and Instagram.", bold_prefix="Background: ")
    add_bullet("Wants to monetize high-resolution digital art directly, protect intellectual property, and earn automated royalties from secondary market sales.", bold_prefix="Primary Goal: ")
    add_bullet("Overwhelmed by smart contract development, gas fee fluctuations, IPFS pinning, and configuring complex ERC-721 metadata attributes.", bold_prefix="Key Frustrations: ")
    add_bullet("A clean, visual minting studio where she can upload image files, choose a preset, set a 10% royalty split with a slider, select a fixed price or auction, and deploy in one click.", bold_prefix="What Elena Needs from PixelMint: ")

    add_h2("4.2 Persona 2: Marcus Chen — The Digital Art Collector")
    add_bullet("Tech-savvy professional who owns cryptocurrencies (ETH, SOL) and follows emerging contemporary digital artists on Twitter/X.", bold_prefix="Background: ")
    add_bullet("Discovers unique 1-of-1 digital artworks, verifies authenticity and creator identity, and acquires high-potential assets at fair market prices.", bold_prefix="Primary Goal: ")
    add_bullet("Encountering fake listings, lack of transparent collection volume data, confusing bid increments, and unexpected transaction failures at checkout.", bold_prefix="Key Frustrations: ")
    add_bullet("Instant checkout with transparent gas estimates, verified artist badges, rich attribute viewing, and a dedicated personal profile showing net portfolio valuation and collection history.", bold_prefix="What Marcus Needs from PixelMint: ")

    add_h2("4.3 Persona 3: Sophia Patel — The Web3 Beginner / Explorer")
    add_bullet("College student and digital art enthusiast who has heard about NFTs in news media and design courses but has never made a blockchain transaction.", bold_prefix="Background: ")
    add_bullet("Wants to explore what NFTs are, browse aesthetic artworks, and understand how digital ownership works without risking real personal savings.", bold_prefix="Primary Goal: ")
    add_bullet("Intimidated by seed phrases, terrified of clicking 'Confirm' on MetaMask, and confused by cryptocurrency exchange transfers and gas terminology.", bold_prefix="Key Frustrations: ")
    add_bullet("A safe, frictionless sandbox experience where she can connect a simulated wallet, claim free test ETH from a faucet, experiment with buying or bidding, and see immediate visual feedback.", bold_prefix="What Sophia Needs from PixelMint: ")

    # =========================================================================
    # 5. USER PROBLEMS AND NEEDS
    # =========================================================================
    add_h1("5. User Problems and Needs Matrix")
    add_body(
        "The following matrix aligns observed user problems across our three target personas with specific user needs, the resulting "
        "product responses engineered into PixelMint, and an honest assessment of current prototype implementation."
    )

    upn_headers = ["Target User", "Observed Problem", "Underlying User Need", "PixelMint Product Response", "Prototype Reality"]
    upn_widths = [1.1, 1.5, 1.4, 1.5, 1.0]
    upn_data = [
        [
            "Creator (Elena)",
            "Does not know how to write Solidity smart contracts or upload files to IPFS.",
            "Code-free artwork publishing tool with automated token standard configuration.",
            "Creator Studio with drag-and-drop file upload, automated ERC-721 token formatting, and metadata builder.",
            "Functional UI. Stores base64 / URLs in local state."
        ],
        [
            "Creator (Elena)",
            "Lacks control over secondary sale compensation on open marketplaces.",
            "Predictable, customizable creator royalty split enforced at token creation.",
            "Configurable royalty slider (0% to 20%) during the minting process, saved in token attributes.",
            "Implemented in data model and checkout breakdown."
        ],
        [
            "Buyer (Marcus)",
            "Checkout pages obscure network fees until wallet confirmation popups appear.",
            "Complete upfront cost certainty prior to initiating any transaction signature.",
            "Instant Checkout modal showing item price, estimated gas fee (~0.0035 ETH), creator royalty, and total cost.",
            "Fully implemented with balance check & deduction."
        ],
        [
            "Buyer (Marcus)",
            "Difficult to assess whether a listed item is genuine or from a copycat collection.",
            "Visual trust signals and immutable provenance history on asset pages.",
            "Verified creator badges, collection volume rankings, and complete chronological transaction history tabs.",
            "Fully implemented in UI with mock history logs."
        ],
        [
            "Beginner (Sophia)",
            "Fear of financial loss while learning how Web3 marketplace mechanics work.",
            "Risk-free simulation environment with guided actions and test funds.",
            "1-click test faucet (+5.0 ETH), simulated multi-wallet connection, and educational toast notifications.",
            "Fully implemented. Allows complete end-to-end sandbox testing."
        ],
        [
            "Beginner (Sophia)",
            "Unclear whether transactions succeeded, failed, or are stuck pending on-chain.",
            "Immediate, friendly feedback on transactional status without cryptic hash strings.",
            "Multi-stage modal progress states (Checkout -> Processing -> Confirmed) paired with global toast alerts.",
            "Fully implemented via asynchronous simulation."
        ],
    ]
    create_custom_table(upn_headers, upn_widths, upn_data)

    # =========================================================================
    # 6. PRODUCT GOALS
    # =========================================================================
    add_h1("6. Product Goals")
    add_body(
        "To guide product decisions and prioritize development efforts, five realistic product goals were established. These goals "
        "focus on usability, transparency, and architectural clarity rather than speculative commercial vanity metrics:"
    )

    add_bullet(
        "Enable users to browse, search, and filter a diverse catalog of digital assets within 2 clicks from the homepage, providing instant "
        "filtering by price, category, sale type, and creator verification without page reloads.",
        bold_prefix="Goal 1: Simplify Digital Asset Discovery: "
    )
    add_bullet(
        "Ensure 100% of purchase, bidding, and minting flows display upfront line-item cost summaries—including estimated network fees and "
        "creator royalties—eliminating unexpected fee surprises at the point of confirmation.",
        bold_prefix="Goal 2: Deliver Transparent Transaction Economics: "
    )
    add_bullet(
        "Provide an intuitive, code-free creator studio that enables digital artists to configure token title, description, category, "
        "pricing structure, royalties, and custom trait attributes in under 3 minutes.",
        bold_prefix="Goal 3: Streamline 1-of-1 NFT Creation and Listing: "
    )
    add_bullet(
        "Offer a safe, educational onboarding experience where first-time Web3 explorers can connect a simulated wallet, switch networks, "
        "and claim test funds with zero setup friction and zero personal financial risk.",
        bold_prefix="Goal 4: Demystify Wallet Onboarding via Safe Simulation: "
    )
    add_bullet(
        "Maintain clear provenance tracking for every asset by recording minting events, direct sales, bids, and owner transfers in "
        "an accessible, readable transaction timeline on the item detail page.",
        bold_prefix="Goal 5: Provide Complete Item Provenance & Traceability: "
    )

    # =========================================================================
    # 7. USER JOURNEYS
    # =========================================================================
    add_h1("7. User Journeys")
    add_body(
        "The following step-by-step user journeys document how key personas navigate PixelMint to accomplish their primary goals. "
        "Each journey maps the current functional flow built into the application codebase."
    )

    add_h2("7.1 Journey A: First-Time User Exploring the Marketplace (Sophia)")
    add_bullet("Sophia arrives at PixelMint landing page (HomePage.tsx), views live market pulse ticker, hero drop, and curated statistics.", bold_prefix="Step 1 (Landing): ")
    add_bullet("Clicks 'Explore Marketplace' button in hero section or 'Explore' link in fixed Navbar.", bold_prefix="Step 2 (Explore Navigation): ")
    add_bullet("Browses catalog grid in ExplorePage.tsx. Clicks category pill 'Collectibles' to filter items.", bold_prefix="Step 3 (Category Filtering): ")
    add_bullet("Types 'Cyber' into the search input. The catalog dynamically updates in real time to show matching items.", bold_prefix="Step 4 (Search Query): ")
    add_bullet("Clicks 'Filters' to open advanced drawer. Adjusts price range slider to maximum 5 ETH and selects 'Price: Low to High' from sort dropdown.", bold_prefix="Step 5 (Advanced Refinement): ")
    add_bullet("Clicks on 'Pixel Punk #1337' card to navigate to NFTDetailPage.tsx to examine full artwork, traits, and historical sales.", bold_prefix="Step 6 (Item Inspection): ")

    add_h2("7.2 Journey B: NFT Buyer Completing a Fixed-Price Purchase (Marcus)")
    add_bullet("Marcus discovers 'Cosmic Dreamer #42' listed at 2.45 ETH on NFTDetailPage.tsx.", bold_prefix="Step 1 (Item Selection): ")
    add_bullet("Reviews item metadata: verifies creator is 'CryptoArtist' (Verified badge), checks ERC-721 token standard, 10% royalty split, and previous sale history.", bold_prefix="Step 2 (Provenance Check): ")
    add_bullet("Clicks 'Buy Now' button. System detects wallet is disconnected and automatically opens WalletModal.tsx.", bold_prefix="Step 3 (Wallet Prompt): ")
    add_bullet("Selects 'MetaMask'. Modal displays brief spinner, completes simulated connection, updates Navbar with wallet address and 14.85 ETH balance.", bold_prefix="Step 4 (Wallet Connection): ")
    add_bullet("BuyModal.tsx opens with item preview, base price (2.45 ETH), estimated gas fee (~0.0035 ETH), royalty split, and total cost (2.4535 ETH).", bold_prefix="Step 5 (Cost Breakdown Review): ")
    add_bullet("System verifies Marcus's balance (14.85 ETH > 2.4535 ETH). Balance indicator glows green.", bold_prefix="Step 6 (Balance Verification): ")
    add_bullet("Marcus clicks 'Confirm & Pay'. Modal advances to 'Processing on Chain' state with loading spinner.", bold_prefix="Step 7 (Execution): ")
    add_bullet("Purchase completes: 2.4535 ETH is deducted, item ownership transfers to Marcus, new 'Sold' transaction is prepended to history, new activity is logged, and a success toast notification appears.", bold_prefix="Step 8 (Settlement & Feedback): ")

    add_h2("7.3 Journey C: NFT Creator Minting and Listing a New Artwork (Elena)")
    add_bullet("Elena connects her wallet via Navbar and clicks 'Create' in navigation to open CreatePage.tsx.", bold_prefix="Step 1 (Studio Access): ")
    add_bullet("Drags and drops high-resolution PNG artwork onto the upload dropzone. System renders immediate visual preview.", bold_prefix="Step 2 (Artwork Upload): ")
    add_bullet("Enters NFT title ('Neon Dimension #01') and detailed artistic description.", bold_prefix="Step 3 (Metadata Entry): ")
    add_bullet("Selects category ('Art') and target blockchain ('Ethereum').", bold_prefix="Step 4 (Classification): ")
    add_bullet("Selects listing format: clicks 'Fixed Price' and enters 1.5 ETH. Adjusts royalty slider to 10%.", bold_prefix="Step 5 (Pricing & Royalties): ")
    add_bullet("Adds custom on-chain traits: clicks 'Add Trait' and defines 'Atmosphere: Cyberpunk' and 'Rarity: Genesis Drop'.", bold_prefix="Step 6 (Trait Configuration): ")
    add_bullet("Reviews gas estimate (~0.012 ETH) and clicks 'Deploy & Mint NFT'.", bold_prefix="Step 7 (Mint Submission): ")
    add_bullet("System validates required fields, deducts 0.012 ETH simulated gas, creates new NFT object, prepends it to the global catalog, logs 'Minted' activity, and displays celebration confirmation screen with direct link to view listing.", bold_prefix="Step 8 (Mint Confirmation): ")

    add_h2("7.4 Journey D: Timed Auction Bidding Flow")
    add_bullet("User navigates to an auction item (e.g., 'Abstract Genesis' with highest bid 4.80 ETH).", bold_prefix="Step 1 (Auction Discovery): ")
    add_bullet("Clicks 'Place Bid'. BidModal.tsx opens showing current highest bid and minimum valid increment (4.90 ETH).", bold_prefix="Step 2 (Bid Initiation): ")
    add_bullet("User uses quick increment buttons (+0.1, +0.5, +1.0) or types custom bid of 5.50 ETH.", bold_prefix="Step 3 (Bid Adjustment): ")
    add_bullet("System validates bid is higher than 4.80 ETH and verifies user balance is sufficient.", bold_prefix="Step 4 (Validation): ")
    add_bullet("User submits bid. System updates highest bid, adds bid to bid history array, logs 'Bid Placed' user activity, and displays success toast.", bold_prefix="Step 5 (Bid Settlement): ")

    add_h2("7.5 Journey E: Submitting an Off-Market Offer")
    add_bullet("User views an item owned by another collector and clicks 'Make Offer' on NFTDetailPage.tsx.", bold_prefix="Step 1 (Offer Initiation): ")
    add_bullet("MakeOfferModal.tsx opens displaying listing price and owner name.", bold_prefix="Step 2 (Offer Form): ")
    add_bullet("User inputs offer amount in ETH (e.g., 2.0 ETH) and selects expiration duration (1 day, 3 days, or 7 days).", bold_prefix="Step 3 (Terms Selection): ")
    add_bullet("User clicks 'Submit Offer'. System validates amount, generates pseudo transaction hash, records 'Offer Made' in user activity feed, and notifies user via toast.", bold_prefix="Step 4 (Offer Dispatch): ")

    # =========================================================================
    # 8. PRODUCT SCOPE
    # =========================================================================
    add_h1("8. Product Scope")
    add_body(
        "Establishing rigorous scope boundaries is a foundational product management responsibility. To maintain focus during project "
        "execution, features were categorized strictly into In-Scope (built in the current prototype) and Out-of-Scope (reserved for future engineering)."
    )

    add_h2("8.1 In Scope (Current Prototype Implementation)")
    add_bullet("Complete catalog browsing with real-time responsive grid layout (3 vs 4 column toggle).", bold_prefix="• Marketplace Discovery: ")
    add_bullet("Title, creator, collection, and category keyword matching with instant suggestions dropdown.", bold_prefix="• Search System: ")
    add_bullet("Multi-criteria filtering by category pills, sale type (Fixed vs Auction), price range slider, verified status, and sorting.", bold_prefix="• Catalog Refinement: ")
    add_bullet("Comprehensive item view with image viewport, metadata attributes, pricing cards, and transaction history tabs.", bold_prefix="• Item Detail Presentation: ")
    add_bullet("Simulated multi-provider connection (MetaMask, WalletConnect, Phantom, Coinbase, Rainbow) and network switcher.", bold_prefix="• Web3 Connection Experience: ")
    add_bullet("1-click +5 ETH faucet for testing transactional flows without real monetary expense.", bold_prefix="• Testnet Simulation Faucet: ")
    add_bullet("Form-based minting studio supporting file uploads, image drag-and-drop, curated art presets, custom traits, and royalties.", bold_prefix="• Creator Studio: ")
    add_bullet("Instant checkout modal with gas estimation, balance validation, state reassignment, and persistence.", bold_prefix="• Atomic Purchase Flow: ")
    add_bullet("Live timed auction bidding modal with dynamic increment buttons and activity logs.", bold_prefix="• Auction Bidding: ")
    add_bullet("Proposal modal allowing custom offer amounts and expiration durations.", bold_prefix="• Direct Offer Negotiation: ")
    add_bullet("Collector profile displaying owned items, created drops, favorited items, portfolio value, and activity history.", bold_prefix="• User Profile & Inventory: ")
    add_bullet("Top collections ranking table with floor price, 24h volume, time range selector, and search.", bold_prefix="• Collections Leaderboard: ")
    add_bullet("Automatic persistence of all user actions (mints, buys, bids, likes, profile edits) to browser localStorage.", bold_prefix="• Local Data Persistence: ")

    add_h2("8.2 Out of Scope / Future Considerations")
    add_bullet("Deploying production Solidity smart contracts to public testnets (Sepolia/Goerli) or Ethereum mainnet.", bold_prefix="• Live Smart Contract Deployment: ")
    add_bullet("Direct integration with browser extension RPCs via ethers.js, viem, or wagmi.", bold_prefix="• Real Web3 Injected Providers: ")
    add_bullet("Direct decentralized file pinning to IPFS/Filecoin or Arweave nodes (currently uses base64 data URLs / HTTPS).", bold_prefix="• Decentralized Storage Pinning: ")
    add_bullet("Production gasless meta-transactions (EIP-2771 / Biconomy) or automated Layer-2 state bridging.", bold_prefix="• Layer-2 Gasless Rollups: ")
    add_bullet("Automated computer vision and generative AI description generation for uploaded artwork.", bold_prefix="• AI-Assisted Creator Tools: ")
    add_bullet("Credit card / Apple Pay fiat checkout integration via Stripe, MoonPay, or Ramp.", bold_prefix="• Fiat Currency On-Ramp: ")
    add_bullet("Escrow-backed offer acceptance allowing sellers to accept or counter open offers directly.", bold_prefix="• Off-Chain Orderbook & Escrow Settlement: ")
    add_bullet("Native iOS or Android mobile applications (web interface is fully mobile-responsive).", bold_prefix="• Native Mobile Apps: ")

    # =========================================================================
    # 9. FEATURE OVERVIEW
    # =========================================================================
    add_h1("9. Feature Overview Matrix")
    add_body(
        "The following table provides a comprehensive inventory of PixelMint's features, organized by user persona, MoSCoW priority, "
        "and verified implementation status based on codebase inspection."
    )

    feat_headers = ["Feature", "Core Purpose", "Target User", "Priority", "Implementation Status"]
    feat_widths = [1.3, 2.0, 1.1, 0.9, 1.2]
    feat_data = [
        ["Explore Catalog", "Browse active digital artworks in a responsive visual grid", "All Users", "Must Have", "Implemented (Functional)"],
        ["Real-time Search", "Search assets by title, artist, category, or collection", "Buyer / Collector", "Must Have", "Implemented (Functional)"],
        ["Dynamic Filters", "Filter by category, price slider, sale type, and verification", "Buyer / Collector", "Must Have", "Implemented (Functional)"],
        ["NFT Detail Page", "Inspect full asset metadata, attributes, and provenance history", "Buyer / Collector", "Must Have", "Implemented (Functional)"],
        ["Wallet Modal", "Simulate connecting Web3 wallets and network switching", "All Users", "Must Have", "Implemented (Simulated)"],
        ["Testnet Faucet", "Claim test ETH (+5 ETH) to safely evaluate marketplace flows", "Beginner / Explorer", "Must Have", "Implemented (Functional)"],
        ["Creator Studio", "Upload artwork, set price, traits, royalties, and mint token", "Creator / Artist", "Must Have", "Implemented (Functional)"],
        ["Instant Buy Checkout", "Execute fixed-price purchase with gas fee breakdown", "Buyer / Collector", "Must Have", "Implemented (Functional)"],
        ["Auction Bidding", "Place competitive bids on timed auction listings", "Buyer / Collector", "Should Have", "Implemented (Functional)"],
        ["Make Offer", "Submit price proposals with expiration to asset owners", "Buyer / Collector", "Should Have", "Implemented (Functional)"],
        ["Profile & Inventory", "Track owned, created, favorited NFTs and total valuation", "Collector / Creator", "Should Have", "Implemented (Functional)"],
        ["Collections Board", "View top collections ranked by volume, floor, and change", "Collector / Buyer", "Should Have", "Implemented (Functional)"],
        ["State Persistence", "Persist mints, buys, bids, and profile edits to localStorage", "All Users", "Must Have", "Implemented (Functional)"],
        ["Real Web3 RPCs", "Execute real on-chain transactions via browser wallet extensions", "All Users", "Could Have", "To Be Verified / Future"],
        ["IPFS File Storage", "Pin asset images and JSON metadata to decentralized storage", "Creator / Artist", "Could Have", "Not Implemented / Future"],
        ["AI Description Tool", "Automatically generate draft NFT descriptions from uploaded art", "Creator / Artist", "Future", "Not Implemented / Future"],
        ["Fiat On-Ramp", "Purchase NFTs using credit cards without holding cryptocurrency", "Beginner / Explorer", "Future", "Not Implemented / Future"],
    ]
    create_custom_table(feat_headers, feat_widths, feat_data)

    # =========================================================================
    # 10. MVP DEFINITION
    # =========================================================================
    add_h1("10. MVP Definition & Scope Rationale")
    add_body(
        "A common pitfall in junior product management is overscoping the Minimum Viable Product (MVP). An MVP should represent the "
        "smallest conceivable version of the product that delivers meaningful value and validates core assumptions. For PixelMint, the MVP "
        "was strictly defined around the core transaction loop: Discover -> Connect -> Mint -> Buy."
    )

    add_h2("10.1 Features Included in the MVP & Strategic Rationale")
    add_bullet(
        "Without an aesthetic, responsive catalog, users cannot discover assets. A marketplace has zero utility without inventory display.",
        bold_prefix="1. Marketplace Discovery & Catalog (Must Have): "
    )
    add_bullet(
        "Users need to locate specific artists and filter by price affordability. Basic keyword search and price bounding are critical to reduce bounce rates.",
        bold_prefix="2. Keyword Search & Price Filtering (Must Have): "
    )
    add_bullet(
        "Digital assets require provenance proof. Displaying token standards, creator verification, trait rarity, and description is required for purchase consideration.",
        bold_prefix="3. NFT Detail View & Metadata Presentation (Must Have): "
    )
    add_bullet(
        "Web3 transactions require an identity. A simulated multi-wallet interface and 1-click test faucet allow users to test transactions without financial risk.",
        bold_prefix="4. Simulated Wallet Connection & Test Faucet (Must Have): "
    )
    add_bullet(
        "A marketplace cannot grow without supply. Creators must be able to upload images, set prices, and mint assets without touching smart contract code.",
        bold_prefix="5. Guided Creator Studio (Must Have): "
    )
    add_bullet(
        "The core transaction that proves marketplace mechanics. Must validate wallet balance, display gas estimates, transfer ownership, and update state.",
        bold_prefix="6. Instant Checkout / Direct Buy (Must Have): "
    )

    add_h2("10.2 Features Excluded from MVP (Deliberate Trade-Offs)")
    add_bullet(
        "Timed auctions introduce complex asynchronous state management (countdown timers, reserve prices, bid cancellation). Fixed price was sufficient to validate transaction demand.",
        bold_prefix="• Timed Auctions (Pushed to Phase 2): "
    )
    add_bullet(
        "Bilateral offer negotiations require off-chain signature orderbooks or escrow contracts. Fixed checkout was prioritized.",
        bold_prefix="• Off-Market Offers (Pushed to Phase 2): "
    )
    add_bullet(
        "While AI-assisted descriptions represent an exciting creator tool, it is a secondary value-add. The core minting engine had to function first.",
        bold_prefix="• AI Description Generation (Pushed to Phase 3): "
    )
    add_bullet(
        "Adds payment gateway complexity, KYC verification, and chargeback risks. Crypto-native simulation was prioritized for the initial scope.",
        bold_prefix="• Fiat Currency Processing (Pushed to Future): "
    )

    # =========================================================================
    # 11. FUNCTIONAL REQUIREMENTS
    # =========================================================================
    add_h1("11. Functional Requirements")
    add_body(
        "The functional requirements below define the specific capabilities of PixelMint. Each requirement includes a unique identifier, "
        "detailed specification, priority, and verified implementation status in the codebase."
    )

    fr_headers = ["ID", "Feature Name", "Requirement Specification", "Priority", "Implementation Status"]
    fr_widths = [0.7, 1.3, 2.4, 0.9, 1.2]
    fr_data = [
        ["FR-01", "Marketplace Catalog", "The system shall display active NFT listings in a responsive grid with image, title, creator, price, likes, and sale format.", "Must Have", "Implemented (Functional)"],
        ["FR-02", "Instant Search", "The system shall allow users to search assets by title, creator name, collection, and category with real-time dynamic matching.", "Must Have", "Implemented (Functional)"],
        ["FR-03", "Category Filtering", "The system shall filter the catalog across predefined categories: All, Art, Collectibles, Photography, Music, Gaming, Virtual Worlds.", "Must Have", "Implemented (Functional)"],
        ["FR-04", "Price Range Filter", "The system shall provide an interactive slider allowing users to filter items between 0 and 15 ETH.", "Must Have", "Implemented (Functional)"],
        ["FR-05", "Sale Type Filter", "The system shall allow filtering by sale mechanism: All, Fixed Price listings only, or Timed Auction listings only.", "Should Have", "Implemented (Functional)"],
        ["FR-06", "Verified Only Filter", "The system shall provide a toggle to restrict displayed listings to verified creators only.", "Should Have", "Implemented (Functional)"],
        ["FR-07", "Catalog Sorting", "The system shall allow sorting by Recently Added, Price: Low to High, Price: High to Low, and Most Popular (likes).", "Must Have", "Implemented (Functional)"],
        ["FR-08", "NFT Detail Page", "The system shall provide a dedicated view showing high-resolution artwork, creator/owner cards, token ID, standard, description, traits, and history.", "Must Have", "Implemented (Functional)"],
        ["FR-09", "Favorite / Like", "The system shall allow users to toggle favorites on any NFT, updating like count and persisting liked IDs in local storage.", "Should Have", "Implemented (Functional)"],
        ["FR-10", "Wallet Connection", "The system shall provide an interactive modal simulating connection for MetaMask, WalletConnect, Coinbase, Phantom, and Rainbow.", "Must Have", "Implemented (Simulated)"],
        ["FR-11", "Network Switching", "The system shall allow users to toggle active blockchain context between Ethereum, Polygon, Arbitrum, and Solana.", "Should Have", "Implemented (Simulated UI)"],
        ["FR-12", "Test Faucet", "The system shall provide a 1-click test faucet in Navbar and modals that credits +5.0 simulated ETH to the user's test balance.", "Must Have", "Implemented (Functional)"],
        ["FR-13", "Artwork Upload", "The system shall allow creators to upload images via file dialog or drag-and-drop, converting files to base64 Data URLs with live preview.", "Must Have", "Implemented (Functional)"],
        ["FR-14", "Minting Studio", "The system shall validate title, description, price, category, blockchain, and royalty (0-20%) before minting new tokens.", "Must Have", "Implemented (Functional)"],
        ["FR-15", "Trait Builder", "The system shall allow creators to dynamically add and remove custom trait_type and value metadata attribute pairs.", "Should Have", "Implemented (Functional)"],
        ["FR-16", "Instant Checkout", "The system shall calculate total cost (price + gas), check balance sufficiency, deduct balance, reassign owner, and log transaction.", "Must Have", "Implemented (Functional)"],
        ["FR-17", "Auction Bidding", "The system shall validate bids > highest bid, verify balance, update highest bid, record bidder info, and log bid activity.", "Should Have", "Implemented (Functional)"],
        ["FR-18", "Make Offer", "The system shall allow users to propose custom offer amounts and expiration durations (1, 3, 7 days) and log offer activities.", "Should Have", "Implemented (Functional)"],
        ["FR-19", "Profile Management", "The system shall display collected, created, favorited NFTs, portfolio value, and allow editing profile name, bio, and avatar.", "Should Have", "Implemented (Functional)"],
        ["FR-20", "Data Reset", "The system shall provide a 1-click control to clear localStorage and restore default marketplace demo datasets.", "Could Have", "Implemented (Functional)"],
    ]
    create_custom_table(fr_headers, fr_widths, fr_data)

    # =========================================================================
    # 12. USER STORIES
    # =========================================================================
    add_h1("12. User Stories")
    add_body(
        "To ensure development remained user-centric, requirements were translated into standard Agile user stories mapped to target personas:"
    )

    stories = [
        ("US-01", "As a prospective buyer, I want to browse digital artworks in an organized grid, so that I can discover new art and creators easily."),
        ("US-02", "As a collector with a budget, I want to filter listings by price range and sale format, so that I only see items I can afford to buy."),
        ("US-03", "As an art enthusiast, I want to search by artist name or keyword, so that I can quickly locate specific artworks I have seen elsewhere."),
        ("US-04", "As a cautious buyer, I want to inspect smart contract token specs and creator verification, so that I know the asset is authentic before buying."),
        ("US-05", "As a collector, I want to review historical sales and ownership transfers on an item, so that I can evaluate its market liquidity and provenance."),
        ("US-06", "As a Web3 newcomer, I want to connect my wallet with a simple visual selector, so that I do not have to struggle with complex technical configurations."),
        ("US-07", "As a student / tester, I want to claim free test ETH from a faucet, so that I can test buying and minting without risking real money."),
        ("US-08", "As an independent artist, I want to drag and drop my artwork into a minting tool, so that I can see an instant visual preview of my NFT."),
        ("US-09", "As a creator, I want to define a creator royalty percentage up to 20%, so that I can receive automated compensation on secondary market resales."),
        ("US-10", "As a creator, I want to add custom rarity traits (e.g., Background, Rarity Tier), so that my NFT adheres to standard metadata conventions."),
        ("US-11", "As a buyer, I want to see an upfront line-item breakdown of item price and estimated gas before paying, so that I am never surprised by hidden fees."),
        ("US-12", "As an auction participant, I want to place bids with 1-click increment buttons, so that I can compete in timed auctions quickly."),
        ("US-13", "As a prospective buyer, I want to make an off-market offer with an expiration date, so that the seller can consider my proposal if the price is right."),
        ("US-14", "As a collector, I want a personal profile showing my collected NFTs and total portfolio valuation, so that I can manage my digital asset inventory."),
    ]

    for sid, stext in stories:
        add_bullet(stext, bold_prefix=f"{sid}: ")

    # =========================================================================
    # 13. ACCEPTANCE CRITERIA
    # =========================================================================
    add_h1("13. Acceptance Criteria")
    add_body(
        "To establish unambiguous definitions of 'done' for engineering implementation, explicit acceptance criteria were authored for "
        "the primary user flows:"
    )

    add_h2("13.1 Marketplace Discovery & Catalog Filtering")
    add_bullet("Given a user on the Explore page, when selecting a category pill, then only NFTs matching that category must be displayed.")
    add_bullet("Given an active search query, when the user types in the search bar, then results must update instantly without requiring page refresh.")
    add_bullet("Given the price slider, when adjusted to X ETH, then all items priced above X ETH must be filtered out.")
    add_bullet("Given active filters resulting in 0 matches, then a friendly 'No NFTs Found' state with a 'Reset Filters' button must appear.")

    add_h2("13.2 NFT Detail & Provenance")
    add_bullet("Given an NFT detail page, the system must display high-res artwork, category tag, network badge, creator card, and current owner card.")
    add_bullet("When the user clicks the 'Favorite' heart icon, the like count must increment/decrement immediately and persist across browser reloads.")
    add_bullet("When clicking 'History' tab, the chronological log of Minted, Listed, Sold, and Bid transactions must be visible with addresses and dates.")
    add_bullet("When clicking the contract address, the address must be copied to clipboard and trigger a confirmation toast alert.")

    add_h2("13.3 Wallet Connection & Faucet")
    add_bullet("When an unauthenticated user clicks 'Connect Wallet', the modal must present MetaMask, WalletConnect, Coinbase, Phantom, and Rainbow.")
    add_bullet("When a wallet is selected, the modal must display a brief connection indicator and update the Navbar with truncated address and balance.")
    add_bullet("When the user clicks '+5 ETH Faucet' in the Navbar or checkout modal, the balance must increment by exactly 5.0 ETH.")

    add_h2("13.4 Creator Studio & Minting")
    add_bullet("The minting form must require NFT Title, Description, Listing Price (> 0), and an uploaded artwork or chosen preset.")
    add_bullet("If any mandatory field is missing, inline validation error messages in red must prevent form submission.")
    add_bullet("The creator must be able to dynamically add trait rows and delete trait rows.")
    add_bullet("Upon submission, the system must check gas sufficiency (~0.012 ETH), deduct gas, prepend the new NFT to the global catalog, and render a success screen.")

    add_h2("13.5 Instant Checkout / Buy Now")
    add_bullet("The checkout modal must display artwork preview, item price in ETH and USD, estimated gas (~0.0035 ETH), and creator royalty percentage.")
    add_bullet("If the user's wallet balance is less than total cost, the 'Confirm & Pay' button must be disabled and display an 'Insufficient Funds' warning with a 1-click faucet button.")
    add_bullet("Upon confirmation, the system must deduct total cost, reassign ownership to the active user, prepend a 'Sold' entry into transaction history, log user activity, and display a success toast.")

    add_h2("13.6 Auction Bidding & Offers")
    add_bullet("In the bid modal, the bid amount must default to at least current highest bid + 0.1 ETH.")
    add_bullet("Any bid entered equal to or below the current highest bid must be rejected with an inline validation error.")
    add_bullet("Submitting a bid must update highestBid on the NFT, record the bid in the bids tab, and log 'Bid Placed' in user activity.")

    # =========================================================================
    # 14. NON-FUNCTIONAL REQUIREMENTS
    # =========================================================================
    add_h1("14. Non-Functional Requirements")
    add_body(
        "Non-functional requirements specify qualitative benchmarks regarding how the system should operate across usability, "
        "performance, reliability, and security:"
    )

    add_h2("14.1 Usability & Responsive UI")
    add_bullet("The application must render fluidly across mobile (<640px), tablet (640px–1024px), and desktop (>1024px) viewports using responsive grid layouts.", bold_prefix="• Cross-Device Responsiveness: ")
    add_bullet("Interactive buttons, cards, and modal triggers must provide clear hover, active, focus, and disabled states.", bold_prefix="• Micro-Interactions: ")
    add_bullet("High contrast typography (white/gray on dark surface-950 background) ensuring readability for digital art inspection.", bold_prefix="• Visual Contrast: ")

    add_h2("14.2 Performance & Latency")
    add_bullet("Catalog filtering, sorting, and keyword searching must execute within <100ms in-browser without UI stutter or unneeded network overhead.", bold_prefix="• Client-Side Latency: ")
    add_bullet("The production singlefile bundle must compile in <3 seconds via Vite and load under 500KB gzipped.", bold_prefix="• Build Footprint: ")
    add_bullet("Image cards must gracefully handle image load failures with automatic fallbacks to reliable placeholder assets.", bold_prefix="• Image Resilience: ")

    add_h2("14.3 Security & Trust Communication")
    add_bullet("All transactional flows must clearly communicate what permissions are being granted and what funds are being transferred.", bold_prefix="• Transaction Transparency: ")
    add_bullet("External links (e.g., block explorer links) must include rel='noreferrer' and target='_blank' to protect user privacy.", bold_prefix="• Secure Link Protocols: ")
    add_bullet("Prototype code must never request private keys or actual seed phrases under any circumstances.", bold_prefix="• Zero Custody: ")

    add_h2("14.4 Reliability & State Persistence")
    add_bullet("All user mutations (minted items, purchased items, updated profile data, favorites, bid history) must automatically sync to browser localStorage.", bold_prefix="• Local Storage Sync: ")
    add_bullet("If corrupted data is detected in localStorage, the application must catch JSON parsing errors gracefully and fall back to clean default mock data.", bold_prefix="• Error Resilience: ")

    # =========================================================================
    # 15. UX / UI REQUIREMENTS
    # =========================================================================
    add_h1("15. UX / UI Requirements & Screen Architecture")
    add_body(
        "PixelMint's user interface is built on a dark-mode Web3 design system utilizing Tailwind CSS, glassmorphism card containers, "
        "and neon purple/cyan accent gradients. Below is the structural architectural breakdown of each primary screen in the application:"
    )

    add_h2("15.1 Screen 1: Marketplace Landing Page (HomePage.tsx)")
    add_bullet("Market Pulse Ticker: Top horizontal ribbon displaying live market indicators: ETH Gas (18 Gwei), 24h Volume (2,481 ETH), and Active Collectors.")
    add_bullet("Hero Section: High-impact typography ('Discover & Own Extraordinary Digital Masterpieces'), primary CTA buttons ('Explore Marketplace' and 'Mint Artwork'), and live metric badges (12.5K+ Minted, 48K+ Collectors, 245K ETH Traded).")
    add_bullet("Interactive Showcase Card: Right-hand column displaying featured drop card ('Abstract Genesis') with floating preview cards, live auction badges, and instant buy triggers.")
    add_bullet("Curated Drops Section: 4-column grid showcasing featured artworks with quick buy overlays.")
    add_bullet("Top Collections Leaderboard: Summary grid showing top 6 collections with floor prices, volume, and 24h gain/loss percentages.")
    add_bullet("Educational 'How PixelMint Operates': 4-step card flow explaining Wallet Connection, On-Chain Minting, Instant Checkout, and Secondary Royalties.")

    add_h2("15.2 Screen 2: Explore & Marketplace Catalog (ExplorePage.tsx)")
    add_bullet("Header & Search Bar: Prominent search input with clear button and real-time query filtering.")
    add_bullet("Quick Controls Bar: Sort dropdown (Recently Added, Price Low-High, Price High-Low, Popular), Advanced Filters toggle button with active indicator dot, and Desktop 3 vs 4 column grid layout switcher.")
    add_bullet("Category Filter Pills: Horizontal scrolling pills for All, Art, Collectibles, Photography, Music, Gaming, Virtual Worlds.")
    add_bullet("Advanced Parameters Drawer: Collapsible panel with price range slider (0–15 ETH), sale type toggle (Fixed vs Auction), verified creator checkbox, and 'Reset All' button.")
    add_bullet("Dynamic Results Grid: Responsive card grid rendering NFTCard.tsx components with title, creator avatar, verified badge, price, like count, and format tags.")

    add_h2("15.3 Screen 3: NFT Detail View (NFTDetailPage.tsx)")
    add_bullet("Sticky Artwork Viewport: Left column featuring large framed artwork container, live auction countdown badge, and high-fidelity rendering.")
    add_bullet("Asset Header: Category pill, network indicator, favorite heart button, link copy share button, and Etherscan block explorer link.")
    add_bullet("Creator & Owner Cards: Dual cards showing avatar, name, verification status, and public wallet address.")
    add_bullet("Pricing & Action Box: Prominent price display in ETH and estimated USD, paired with contextual primary action ('Buy Now' vs 'Place Bid') and secondary action ('Make Offer'). If the active user owns the artwork, 'Buy Now' is disabled with the label 'You Own This Artwork'.")
    add_bullet("Segmented Tabs Panel: Three view tabs: 'Details' (description, on-chain trait attribute cards, token ID, ERC-721 standard, royalty split, contract copy button), 'History' (chronological event stream), and 'Bids' (bidder activity log).")

    add_h2("15.4 Screen 4: Creator Minting Studio (CreatePage.tsx)")
    add_bullet("Left Upload Column: Drag-and-drop file upload zone supporting PNG, JPG, WebP with live preview and change overlay. Below it, a 3x2 grid of curated generative artwork sample presets allows 1-click visual selection for quick testing.")
    add_bullet("Creator Identity Card: Visual card confirming the user's active wallet address, avatar, and minting role.")
    add_bullet("Right Configuration Column: Form inputs for NFT Title, Description textarea, Category dropdown, Target Blockchain selector (Ethereum, Polygon, Arbitrum, Solana), Listing Format toggle (Fixed Price vs Timed Auction), Price input, and Creator Royalty slider (0–20%).")
    add_bullet("Dynamic Trait Builder: Repeatable trait inputs allowing creators to specify custom trait_type and value pairs with delete controls.")
    add_bullet("Gas Fee & Security Summary: Estimated network gas card (~0.012 ETH), smart contract reference (PixelMintERC721.sol), current wallet balance, and contextual +5 ETH faucet link if balance is low.")
    add_bullet("Mint Confirmation View: Post-minting modal celebrating deployment with artwork thumbnail, category badge, and buttons to view NFT details or mint another asset.")

    add_h2("15.5 Screen 5: Interactive Modals")
    add_bullet("BuyModal.tsx: Instant checkout modal with artwork thumbnail, cost breakdown (Price + Gas + Royalty = Total), balance verification, 1-click test faucet, and 3-step progress states (Checkout -> Processing -> Confirmed).")
    add_bullet("BidModal.tsx: Timed auction bidding modal with current bid display, auction end time, dynamic increment buttons (+0.1, +0.5, +1.0 ETH), and balance validation.")
    add_bullet("MakeOfferModal.tsx: Direct negotiation modal with offer amount input in ETH and expiration dropdown (1 day, 3 days, 7 days).")
    add_bullet("WalletModal.tsx: Multi-wallet provider modal listing MetaMask, WalletConnect, Coinbase, Phantom, and Rainbow with connection spinners and encrypted protocol badge.")
    add_bullet("EditProfileModal.tsx: Profile customization modal allowing editing display name, handle, bio, email, avatar URL, and banner URL.")

    # =========================================================================
    # 16. EDGE CASES AND ERROR STATES
    # =========================================================================
    add_h1("16. Edge Cases and Error States")
    add_body(
        "A key indicator of thorough product management is anticipating what happens when users deviate from the happy path. "
        "The following table documents 10 realistic edge cases, how the system is specified to behave, and its current prototype handling:"
    )

    edge_headers = ["Edge Case Scenario", "Trigger Condition", "Expected System Behavior", "Prototype Implementation Handling"]
    edge_widths = [1.3, 1.4, 1.9, 1.9]
    edge_data = [
        [
            "Disconnected Wallet on Action",
            "User clicks Buy, Bid, or Offer without connecting a wallet first.",
            "System intercepts action, halts transaction, and automatically launches WalletModal.",
            "Fully implemented. Automatically opens WalletModal.tsx and halts checkout."
        ],
        [
            "Insufficient ETH for Purchase",
            "User wallet balance is lower than (NFT Price + 0.0035 ETH Gas).",
            "System disables confirm button, displays red warning badge, and offers 1-click +5 ETH Faucet.",
            "Fully implemented. Shows exact balance deficit and displays '+5 ETH Faucet' button."
        ],
        [
            "Insufficient ETH for Minting Gas",
            "Creator has less than ~0.012 ETH required for simulated contract deployment.",
            "System displays gas warning and blocks submission until balance is replenished via faucet.",
            "Fully implemented in CreatePage.tsx with inline faucet trigger."
        ],
        [
            "Self-Purchase Attempt",
            "User navigates to an NFT that is currently owned by their own wallet address.",
            "Primary buy button is disabled with label 'You Own This Artwork' to prevent self-trading.",
            "Fully implemented in NFTDetailPage.tsx (checks nft.owner.address === user.address)."
        ],
        [
            "Bid Lower Than Current Highest",
            "Bidder submits a bid equal to or less than current highest bid.",
            "System rejects bid, renders red inline error message, and enforces minimum +0.1 ETH increment.",
            "Fully implemented in BidModal.tsx with real-time validation."
        ],
        [
            "Missing Required Form Fields",
            "Creator submits minting form without title, description, price, or image.",
            "System halts submission, highlights missing fields in red, and displays specific field errors.",
            "Fully implemented with comprehensive validate() form checker in CreatePage.tsx."
        ],
        [
            "Zero Matching Search Results",
            "User enters a query or price range that matches zero catalog items.",
            "System displays centered 'No NFTs Found' empty state with 'Reset All Filters' CTA button.",
            "Fully implemented in ExplorePage.tsx."
        ],
        [
            "Broken Image Source",
            "Remote Unsplash or CDN image URL fails to load due to network error.",
            "Image tag onError handler catches failure and replaces src with fallback artwork.",
            "Fully implemented on image components across detail and catalog cards."
        ],
        [
            "User Cancels Mid-Transaction",
            "User closes modal while reviewing checkout or bidding details.",
            "System aborts flow cleanly, resets modal step, and leaves user balance and state unchanged.",
            "Fully implemented across all modals."
        ],
        [
            "Wallet Disconnection During Session",
            "User disconnects wallet from Navbar dropdown while on an authenticated page.",
            "System updates global state, displays notification toast, and renders clean connect-wallet empty state.",
            "Fully implemented on CreatePage and ProfilePage."
        ],
    ]
    create_custom_table(edge_headers, edge_widths, edge_data)

    # =========================================================================
    # 17. SUCCESS METRICS
    # =========================================================================
    add_h1("17. Proposed Success Metrics — Not Currently Measured")
    add_body(
        "In accordance with product management rigor, this section defines a proposed telemetry and success metric framework for PixelMint. "
        "Because PixelMint is currently a student portfolio prototype, NO live production analytics or user conversion tracking have been executed. "
        "The metrics below represent what should be instrumented prior to a live testnet or mainnet launch."
    )

    add_callout(
        "Telemetry Disclaimer",
        "STATUS: PROPOSED METRIC FRAMEWORK — NOT CURRENTLY MEASURED. "
        "No live production user tracking, telemetry, or analytics platforms (e.g., Mixpanel, Google Analytics, PostHog) are active in the current prototype. "
        "All values below represent target KPIs and hypotheses for future testing.",
        bg_hex="F1F5F9",
        border_color="64748B"
    )

    add_h2("17.1 Proposed Acquisition & Discovery Metrics")
    add_bullet("Percentage of unique landing page visitors who navigate to the Explore catalog or search bar within their first session.", bold_prefix="• Catalog Exploration Rate (Target: >65%): ")
    add_bullet("Frequency of search bar queries, category pill clicks, and filter drawer adjustments per active session.", bold_prefix="• Search & Filter Engagement: ")
    add_bullet("Number of unique NFT detail view sessions per visitor, identifying high-demand artworks and categories.", bold_prefix="• Detail View Throughput: ")

    add_h2("17.2 Proposed Funnel & Conversion Metrics")
    add_bullet("Percentage of users who initiate wallet connection in WalletModal.tsx and successfully complete authentication.", bold_prefix="• Wallet Connection Completion Rate: ")
    add_bullet("Percentage of users who click 'Buy Now' and successfully reach the 'Purchase Confirmed' modal state.", bold_prefix="• Checkout Conversion Funnel: ")
    add_bullet("Percentage of users who open BuyModal.tsx but exit before clicking confirm, specifically tracking exits caused by insufficient balance.", bold_prefix="• Checkout Abandonment Rate: ")
    add_bullet("Percentage of users who open BidModal.tsx and submit a qualifying competitive bid.", bold_prefix="• Auction Bid Conversion Rate: ")

    add_h2("17.3 Proposed Creator Studio Metrics")
    add_bullet("Percentage of users who click 'Create' and successfully complete all steps to deploy a minted NFT.", bold_prefix="• Minting Studio Funnel Completion: ")
    add_bullet("Average elapsed time from entering CreatePage.tsx to completing metadata entry and minting submission (Target: <3 minutes).", bold_prefix="• Time-to-Mint Efficiency: ")
    add_bullet("Distribution of creator royalty percentages selected on the slider (evaluating whether creators prefer 5%, 10%, or 20%).", bold_prefix="• Royalty Preference Distribution: ")

    # =========================================================================
    # 18. RISKS AND MITIGATIONS
    # =========================================================================
    add_h1("18. Risks and Mitigations")
    add_body(
        "Building decentralized applications involves unique technical, economic, and behavioral risks. The matrix below outlines "
        "the primary risks identified for PixelMint, their potential severity, proposed mitigations, and their status in the prototype:"
    )

    risk_headers = ["Risk Identified", "Risk Category", "Severity", "Proposed Mitigation Strategy", "Current Prototype Status"]
    risk_widths = [1.3, 1.1, 0.9, 2.0, 1.2]
    risk_data = [
        [
            "Smart Contract Exploits",
            "Security / Technical",
            "Critical",
            "Use battle-tested OpenZeppelin ERC-721 contracts, formal code audits, and bug bounty programs prior to mainnet.",
            "Mitigation Not Implemented. Prototype uses client-side state simulation."
        ],
        [
            "Network Gas Fee Spikes",
            "Economic / UX",
            "High",
            "Deploy marketplace contracts to Layer-2 rollups (Arbitrum, Optimism, Polygon) and implement EIP-2771 gasless relayers.",
            "Open Consideration. Prototype displays simulated static gas (~0.0035 ETH)."
        ],
        [
            "Wallet UX Confusion",
            "Usability / Adoption",
            "High",
            "Provide plain-language transaction explanations, safe test faucet, and friendly error guidance.",
            "Partially Mitigated via test faucet, multi-wallet selector, and clear modals."
        ],
        [
            "Copyright / IP Infringement",
            "Legal / Content",
            "High",
            "Implement community reporting, creator identity verification, and automated image hash matching to detect duplicates.",
            "Mitigation Not Implemented. Prototype includes visual 'Verified' badges only."
        ],
        [
            "Client Storage Data Loss",
            "Technical / Reliability",
            "Medium",
            "Migrate from browser localStorage to persistent cloud databases (PostgreSQL) and decentralized IPFS pinning.",
            "Prototype uses localStorage with clean 'Reset Demo Data' fallback."
        ],
        [
            "Regulatory & Compliance Uncertainty",
            "Legal / Regulatory",
            "Medium",
            "Ensure tokens represent utility digital art rather than financial securities; maintain terms of service and disclaimers.",
            "Documented in PRD assumptions and portfolio disclaimers."
        ],
    ]
    create_custom_table(risk_headers, risk_widths, risk_data)

    # =========================================================================
    # 19. ASSUMPTIONS
    # =========================================================================
    add_h1("19. Product & Technical Assumptions")
    add_body(
        "Every product requirements document rests on foundational assumptions. Documenting these assumptions ensures stakeholders "
        "understand the operating premises under which PixelMint was designed:"
    )

    add_bullet(
        "We assume target users have access to a modern desktop or mobile web browser and understand the basic concept that digital assets "
        "can be uniquely owned and traded on a blockchain ledger.",
        bold_prefix="1. User Domain Familiarity: "
    )
    add_bullet(
        "We assume users either already own a non-custodial crypto wallet (MetaMask, Phantom, etc.) or are willing to connect one using standard "
        "Web3 provider protocols.",
        bold_prefix="2. Web3 Wallet Accessibility: "
    )
    add_bullet(
        "We assume users understand that blockchain transactions require network fees ('gas') paid in cryptocurrency, and that fees vary "
        "based on network congestion.",
        bold_prefix="3. Transaction Cost Acceptance: "
    )
    add_bullet(
        "We assume digital creators value secondary resale royalties and are motivated to mint when provided with a clean, code-free interface.",
        bold_prefix="4. Creator Royalty Motivation: "
    )
    add_bullet(
        "We assume Ethereum and compatible EVM chains remain the dominant standard for digital art provenance, while recognizing that Layer-2 "
        "rollups are essential for affordable consumer scaling.",
        bold_prefix="5. Technical Infrastructure Standard: "
    )

    # =========================================================================
    # 20. OPEN PRODUCT QUESTIONS
    # =========================================================================
    add_h1("20. Open Product Questions")
    add_body(
        "A mature Product Manager does not pretend every strategic decision has already been finalized. Identifying unresolved questions "
        "demonstrates critical product thinking and establishes an agenda for subsequent research:"
    )

    add_bullet(
        "Should PixelMint deploy primarily to Ethereum Mainnet for prestige and high-value 1-of-1 art drops, or should it launch natively "
        "on an EVM Layer-2 (such as Arbitrum One or Base) to reduce transaction fees for consumer creators? What is the user trade-off between "
        "Layer-1 collector prestige and Layer-2 fee affordability?",
        bold_prefix="1. Primary Blockchain Deployment Architecture: "
    )
    add_bullet(
        "What specific technical architecture should be adopted to eliminate or subsidize gas fees for new users? Should PixelMint implement "
        "an account abstraction model (ERC-4337) with paymasters, or a Biconomy gasless meta-transaction relayer?",
        bold_prefix="2. Gasless Transaction Feasibility: "
    )
    add_bullet(
        "Should off-market offers and auction bids be stored off-chain using cryptographic signatures (similar to OpenSea Seaport protocol) "
        "to save users gas fees until an offer is accepted, or should they be locked on-chain in an escrow contract?",
        bold_prefix="3. Offer & Bid Escrow Mechanics: "
    )
    add_bullet(
        "What level of creator verification is appropriate? Does an open, permissionless minting model invite rampant spam and stolen art, "
        "or does a curated approval process create an elitist barrier that contradicts Web3 principles?",
        bold_prefix="4. Artist Verification & Content Governance: "
    )
    add_bullet(
        "Should secondary creator royalties be strictly enforced via custom contract registries, or should PixelMint support optional "
        "collector tipping in light of broader marketplace fee wars?",
        bold_prefix="5. Royalty Enforcement in Competitive Markets: "
    )

    # =========================================================================
    # 21. FUTURE OPPORTUNITIES
    # =========================================================================
    add_h1("21. Future Opportunities & AI-Assisted Creator Tools")
    add_body(
        "As PixelMint evolves beyond its initial prototype, several high-impact product opportunities have been identified to expand "
        "creator capabilities and market differentiation."
    )

    add_h2("21.1 AI-Assisted NFT Description Generation")
    add_body(
        "One of the most promising future enhancements explored during product planning is an AI-assisted metadata generation workflow. "
        "Many visual artists excel at digital illustration but struggle to write compelling conceptual narratives, lore, and algorithmic process "
        "descriptions for their marketplace listings."
    )
    
    add_h3("Intended Product Workflow")
    add_bullet("Creator drags and drops custom digital artwork into the Creator Studio upload viewport.", bold_prefix="Step 1 (Upload): ")
    add_bullet("The system passes the artwork image to a multimodal vision model (e.g., Gemini Vision API) alongside creator-selected style tags (e.g., Cyberpunk, Surrealism, Generative).", bold_prefix="Step 2 (Vision Analysis): ")
    add_bullet("The AI engine generates a draft conceptual description detailing visual themes, color palette symbolism, and potential artistic lore.", bold_prefix="Step 3 (Draft Generation): ")
    add_bullet("The creator reviews the draft in an editable textarea, modifies tone, adds personal narrative context, and finalizes the text.", bold_prefix="Step 4 (Review & Refinement): ")
    add_bullet("The creator confirms the listing, and the edited description is permanently inscribed into the token's ERC-721 metadata.", bold_prefix="Step 5 (Minting): ")

    add_callout(
        "Implementation Status of AI Description Tool",
        "STATUS: FUTURE ROADMAP / NOT IMPLEMENTED IN CURRENT CODEBASE. "
        "Inspection of the project codebase confirms that no AI APIs, Python backend models, or text generation hooks are active in the current prototype. "
        "This feature is documented here purely as a strategic product opportunity for Phase 3 development.",
        bg_hex="F8FAFC",
        border_color="6366F1"
    )

    add_h2("21.2 Additional Strategic Opportunities")
    add_bullet(
        "Allow creators to upload multi-asset collections (e.g., 50–100 generative variations) with automated ERC-1155 or ERC-721A batch minting, "
        "drastically reducing cumulative deployment costs.",
        bold_prefix="• Batch Minting & Generative Drop Engine: "
    )
    add_bullet(
        "Partner with Web3 payment processors (Stripe Crypto, MoonPay) to enable collectors to purchase digital assets directly using credit "
        "cards, with the backend automatically provisioning non-custodial embedded wallets (e.g., Privy or Dynamic).",
        bold_prefix="• Fiat Credit Card Checkout: "
    )
    add_bullet(
        "Integrate physical redemption mechanisms where token holders can claim physical museum-grade acrylic prints of their digital art "
        "via cryptographic signature verification.",
        bold_prefix="• Physical-Digital ('Phygital') Redeemables: "
    )

    # =========================================================================
    # 22. IMPLEMENTATION STATUS AUDIT
    # =========================================================================
    add_h1("22. Implementation Status & Feature Audit")
    add_body(
        "This section represents a comprehensive, transparent audit of PixelMint's actual codebase. It compares product design intentions "
        "against the reality of the software currently running in the workspace."
    )

    audit_headers = ["Feature Area", "Expected Product Behavior", "Current Code Implementation", "Verified Status", "Technical Assessment & Notes"]
    audit_widths = [1.1, 1.4, 1.5, 1.1, 1.4]
    audit_data = [
        [
            "Catalog Browsing",
            "Browse assets with dynamic card rendering and pagination.",
            "ExplorePage.tsx renders items from MarketplaceContext state.",
            "Implemented",
            "Fully functional. Responsive layout with 3 vs 4 column toggle."
        ],
        [
            "Keyword Search",
            "Search titles, artists, and collections with instant matching.",
            "Instant filter across nfts array with suggestions dropdown in Navbar.",
            "Implemented",
            "Fully functional client-side search. Instant UI response."
        ],
        [
            "Parametric Filters",
            "Filter by category, price slider, sale format, and verification.",
            "useMemo filter hook filtering context nfts array.",
            "Implemented",
            "Fully functional. Includes 'Reset All' button and drawer."
        ],
        [
            "Item Detail View",
            "Inspect artwork, provenance, traits, description, and history.",
            "NFTDetailPage.tsx dynamically pulls by ID with 3 view tabs.",
            "Implemented",
            "Fully functional. Includes clipboard copy and fallback image."
        ],
        [
            "Simulated Wallet",
            "Connect Web3 wallet provider and display truncated address.",
            "WalletModal.tsx simulates connection with 700ms timeout.",
            "Partially Implemented (UI Sim)",
            "Does not invoke window.ethereum or real browser extensions."
        ],
        [
            "Test Faucet",
            "Add test funds to wallet for checkout testing.",
            "addFunds(5.0) increments user.balance in context & localStorage.",
            "Implemented",
            "Fully functional test utility. Accessible via Navbar & modals."
        ],
        [
            "Creator Studio",
            "Upload image, define metadata, traits, royalties, and mint.",
            "CreatePage.tsx handles file reader, validation, and mintNFT().",
            "Implemented",
            "Fully functional. Stores base64 / presets in state & localStorage."
        ],
        [
            "Instant Buy Checkout",
            "Check balance, estimate gas, reassign owner, log transaction.",
            "BuyModal.tsx executes buyNFT() with balance checks and gas fee.",
            "Implemented",
            "Fully functional simulation. Correctly updates ownership."
        ],
        [
            "Auction Bidding",
            "Validate bid > current, update highestBid, log activity.",
            "BidModal.tsx validates bid and updates NFT bids array.",
            "Implemented",
            "Fully functional. Validates balance and minimum increment."
        ],
        [
            "Make Offer",
            "Submit off-market proposal with expiration duration.",
            "MakeOfferModal.tsx validates amount and logs user activity.",
            "Partially Implemented",
            "Logs offer activity and toast; does not notify seller or hold escrow."
        ],
        [
            "Profile Dashboard",
            "Inspect owned, created, favorited NFTs, valuation, and edits.",
            "ProfilePage.tsx filters nfts by user address and liked IDs.",
            "Implemented",
            "Fully functional. Includes EditProfileModal.tsx."
        ],
        [
            "Collections Board",
            "Rank collections by floor, volume, 24h change, and timeframe.",
            "CollectionsPage.tsx displays ranking table with time filter.",
            "Implemented",
            "Fully functional. Clicking navigates to filtered Explore."
        ],
        [
            "Smart Contracts",
            "Deploy and execute ERC-721 contracts on EVM testnet.",
            "No Solidity files (.sol) or hardhat/foundry configs exist.",
            "Not Implemented (Simulated)",
            "Client prototype simulates contracts using pseudo hashes."
        ],
        [
            "Security Auditing",
            "Third-party formal verification of contract security.",
            "Landing page badge states '100% Audited' as UI placeholder.",
            "Not Implemented (UI Only)",
            "No formal audit was performed. Must be clearly acknowledged."
        ],
        [
            "Decentralized IPFS",
            "Pin media and metadata JSON to IPFS or Arweave nodes.",
            "Files stored in memory and localStorage as base64 Data URLs.",
            "Not Implemented / Future",
            "Decentralized storage pipeline reserved for Phase 2."
        ],
        [
            "AI Description Tool",
            "Generate draft artwork descriptions using vision AI.",
            "No AI dependencies, endpoints, or scripts exist in repo.",
            "Not Implemented (Future)",
            "Documented as Phase 3 feature opportunity."
        ],
    ]
    create_custom_table(audit_headers, audit_widths, audit_data)

    # =========================================================================
    # 23. PRODUCT ROADMAP
    # =========================================================================
    add_h1("23. Product Roadmap")
    add_body(
        "To illustrate structured product planning, a phased roadmap is outlined below. It transitions PixelMint from its current "
        "interactive prototype into a fully decentralized, production-grade application."
    )

    add_h2("Phase 1: Interactive Client Prototype (Current MVP — Completed)")
    add_bullet("Design and build core consumer user flows: Catalog Explore, Real-time Search, Dynamic Filters, and Item Details.")
    add_bullet("Implement client-side Creator Studio with drag-and-drop file upload, royalty slider (0-20%), and custom trait builders.")
    add_bullet("Develop simulated transactional engine: multi-wallet connection modal, test faucet (+5 ETH), instant buy checkout, and auction bidding.")
    add_bullet("Establish local state persistence via browser localStorage to ensure continuity during testing and portfolio demonstration.")
    add_bullet("Author complete Product Requirements Document (PRD) documenting user problems, architecture, and feature audit.")

    add_h2("Phase 2: Live Testnet Integration & Web3 Infrastructure (Next Iteration)")
    add_bullet("Author and test secure OpenZeppelin ERC-721 smart contracts on Ethereum Sepolia testnet with ERC-2981 royalty standards.")
    add_bullet("Integrate injected Web3 provider libraries (wagmi / viem / RainbowKit) for live MetaMask and WalletConnect execution.")
    add_bullet("Implement decentralized storage pipeline using Pinata / Infura IPFS APIs for permanent media and JSON metadata hosting.")
    add_bullet("Deploy automated orderbook contract on testnet supporting true escrow-backed offers and reserve-price timed auctions.")
    add_bullet("Deploy to Layer-2 testnet (Arbitrum Sepolia or Base Sepolia) to evaluate real-world gas fee reductions.")

    add_h2("Phase 3: Production Hardening, Creator Tools & AI Integration (Future)")
    add_bullet("Conduct professional smart contract security audit with independent Web3 security firm prior to mainnet deployment.")
    add_bullet("Build and deploy AI-assisted metadata generator using Gemini Vision API to help creators draft conceptual artwork descriptions.")
    add_bullet("Integrate fiat on-ramp gateway (Stripe Crypto / MoonPay) allowing non-crypto users to purchase NFTs using standard debit/credit cards.")
    add_bullet("Implement creator collection launchpad supporting ERC-721A batch generative drops and custom minting allowlists.")

    # =========================================================================
    # 24. CONCLUSION & PM RETROSPECTIVE
    # =========================================================================
    add_h1("24. Conclusion & PM Retrospective")
    add_body(
        "Building and documenting PixelMint has been an invaluable learning experience in product management. When I began this project as my "
        "university capstone, my focus was largely on the novelty of digital art ownership and decentralized marketplace mechanics. However, "
        "as I designed user journeys and analyzed where everyday users get stuck, I quickly realized that the primary barrier to Web3 adoption "
        "is not blockchain throughput—it is user experience empathy."
    )
    add_body(
        "Throughout this project, I learned to make deliberate product trade-offs: prioritizing upfront cost transparency and safe sandbox "
        "simulation over complex, half-baked smart contract integrations. Documenting this PRD reinforced the critical distinction between "
        "product requirements and technical implementation. It taught me that an honest, self-aware assessment of what is working versus what "
        "is simulated is far more valuable than presenting a facade of finished features."
    )
    add_body(
        "PixelMint demonstrates my ability to identify user pain points, define target personas, map comprehensive user journeys, establish "
        "clear MVP boundaries, author rigorous functional requirements, anticipate realistic edge cases, and plan phased evolutionary roadmaps. "
        "These foundational Product Management principles will guide my work as an Associate Product Manager or Junior PM in building thoughtful, "
        "consumer-centric digital products."
    )

    # =========================================================================
    # 25. APPENDIX
    # =========================================================================
    add_h1("25. Appendix")
    
    add_h2("Appendix A: Technical Architecture & Repository Overview")
    add_body(
        "PixelMint is built as a single-page application (SPA) using modern front-end technologies. The table below summarizes "
        "the core technical components verified during codebase inspection:"
    )

    tech_headers = ["Component", "Technology / Package", "Version", "Role in Application"]
    tech_widths = [1.5, 1.8, 0.9, 2.3]
    tech_data = [
        ["Core Framework", "React + TypeScript", "19.2.3 / 5.9.3", "Component hierarchy, type safety, state management"],
        ["Build Tooling", "Vite", "7.2.4", "Rapid development bundling, singlefile production compiling"],
        ["Styling Engine", "Tailwind CSS v4", "4.1.17", "Custom glassmorphism design system, dark mode surface palette"],
        ["Iconography", "Lucide React", "0.577.0", "Clean iconography across navigation, actions, and status badges"],
        ["State Architecture", "React Context API", "Native React 19", "Global marketplace state, wallet state, toasts, modals"],
        ["Data Persistence", "Browser localStorage", "HTML5 Standard", "Persists NFTs, collections, user profile, likes, activities"],
    ]
    create_custom_table(tech_headers, tech_widths, tech_data)

    add_h2("Appendix B: Web3 & NFT Terminology Glossary")
    add_bullet("Non-Fungible Token. A unique digital identifier recorded on a blockchain that certifies ownership and authenticity of a specific asset.", bold_prefix="• NFT (Non-Fungible Token): ")
    add_bullet("The smart contract technical standard on the Ethereum blockchain for non-fungible digital assets, ensuring interoperability.", bold_prefix="• ERC-721 Standard: ")
    add_bullet("The process of validating and inscribing a digital asset onto a blockchain ledger, establishing its initial timestamped provenance.", bold_prefix="• Minting: ")
    add_bullet("Computational execution fees paid to blockchain network validators/minters to process and record transactions.", bold_prefix="• Gas Fee: ")
    add_bullet("An automated percentage of secondary market resales paid directly to the original creator on secondary transfers (standardized by ERC-2981).", bold_prefix="• Creator Royalty: ")
    add_bullet("The lowest currently listed fixed price for an NFT within a specific collection, serving as an entry valuation benchmark.", bold_prefix="• Floor Price: ")
    add_bullet("A digital tool (hardware or software) that manages private keys and allows users to sign blockchain transactions and interact with decentralized apps.", bold_prefix="• Web3 Wallet: ")
    add_bullet("Secondary blockchain networks built on top of Layer-1 (like Ethereum) that batch transactions to achieve higher throughput and lower fees.", bold_prefix="• Layer-2 Rollup: ")
    add_bullet("InterPlanetary File System. A peer-to-peer decentralized storage protocol used to store NFT media files and JSON metadata securely off-chain.", bold_prefix="• IPFS: ")

    # Save Document
    output_filename = "PixelMint_Product_Requirements_Document.docx"
    doc.save(output_filename)
    print(f"PRD successfully generated and saved to {output_filename}")

if __name__ == "__main__":
    build_pixelmint_prd()
