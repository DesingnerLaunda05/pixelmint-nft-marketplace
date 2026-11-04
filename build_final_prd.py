import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_pixelmint_prd_final():
    doc = Document()

    # Base Page Setup: Standard Letter, 0.7-inch margins for executive PM layout
    section = doc.sections[0]
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.7)
    section.right_margin = Inches(0.7)
    section.page_width = Inches(8.5)
    section.page_height = Inches(11.0)
    section.different_first_page_header_footer = True

    # Header for subsequent pages
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hp.paragraph_format.space_after = Pt(2)
    hrun = hp.add_run("PixelMint — Product Requirements Document (Final Recruiter-Ready PRD)")
    hrun.font.name = "Calibri"
    hrun.font.size = Pt(8.0)
    hrun.font.color.rgb = RGBColor(100, 116, 139)

    # Footer for subsequent pages (Clean 2-cell table: left metadata, right Page X of Y)
    footer = section.footer
    footer_p = footer.paragraphs[0]
    footer_p.text = "" # Clear default paragraph
    footer_p.paragraph_format.space_before = Pt(0)
    footer_p.paragraph_format.space_after = Pt(0)

    footer_tbl = footer.add_table(rows=1, cols=2, width=Inches(7.1))
    footer_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    footer_tbl.autofit = False

    # Remove borders on footer table
    tblPr = footer_tbl._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

    c_left = footer_tbl.cell(0, 0)
    c_left.width = Inches(5.1)
    p_fleft = c_left.paragraphs[0]
    p_fleft.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_fleft.paragraph_format.space_before = Pt(0)
    p_fleft.paragraph_format.space_after = Pt(0)
    frun_left = p_fleft.add_run("PixelMint PM Case Study & Feature Specification | Author: Aditya Nair")
    frun_left.font.name = "Calibri"
    frun_left.font.size = Pt(8.0)
    frun_left.font.color.rgb = RGBColor(100, 116, 139)

    c_right = footer_tbl.cell(0, 1)
    c_right.width = Inches(2.0)
    p_fright = c_right.paragraphs[0]
    p_fright.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_fright.paragraph_format.space_before = Pt(0)
    p_fright.paragraph_format.space_after = Pt(0)
    
    frun_p = p_fright.add_run("Page ")
    frun_p.font.name = "Calibri"
    frun_p.font.size = Pt(8.0)
    frun_p.font.color.rgb = RGBColor(100, 116, 139)

    fldSimple_page = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
    p_fright._p.append(fldSimple_page)

    frun_of = p_fright.add_run(" of ")
    frun_of.font.name = "Calibri"
    frun_of.font.size = Pt(8.0)
    frun_of.font.color.rgb = RGBColor(100, 116, 139)

    fldSimple_numpages = parse_xml(r'<w:fldSimple %s w:instr="NUMPAGES"/>' % nsdecls('w'))
    p_fright._p.append(fldSimple_numpages)

    # XML Formatting Helpers
    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=40, bottom=40, left=70, right=70):
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

    def add_callout(title, text, bg_hex="F8FAFC", border_color="2563EB", space_after=3.0):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(7.1)
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=50, bottom=50, left=90, right=80)

        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="single" w:sz="18" w:space="0" w:color="{border_color}"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.06
        run_title = p.add_run(f"{title}: ")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(8.5)
        run_title.font.color.rgb = RGBColor(15, 23, 42)

        run_text = p.add_run(text)
        run_text.font.name = "Calibri"
        run_text.font.size = Pt(8.5)
        run_text.font.color.rgb = RGBColor(51, 65, 85)

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(0)
        p_after.paragraph_format.space_after = Pt(space_after)

    def add_h1(text, space_before=8.0, space_after=2.0):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(12.0)
        run.font.color.rgb = RGBColor(15, 23, 42)
        return p

    def add_h2(text, space_before=5.5, space_after=1.2):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(9.8)
        run.font.color.rgb = RGBColor(30, 41, 59)
        return p

    def add_h3(text, space_before=4.0, space_after=1.0):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(8.8)
        run.font.color.rgb = RGBColor(71, 85, 105)
        return p

    def add_body(text, bold_prefix=None, space_after=1.8, space_before=0):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.05
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(8.5)
            r_pre.font.color.rgb = RGBColor(15, 23, 42)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def add_bullet(text, bold_prefix=None, space_after=1.0):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.05
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(8.5)
            r_pre.font.color.rgb = RGBColor(15, 23, 42)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def create_custom_table(headers, col_widths, rows_data, space_after=2.5):
        table = doc.add_table(rows=1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        set_table_borders(table)

        hdr_cells = table.rows[0].cells
        for i, h_text in enumerate(headers):
            hdr_cells[i].text = h_text
            hdr_cells[i].width = Inches(col_widths[i])
            set_cell_background(hdr_cells[i], "1E293B")
            set_cell_margins(hdr_cells[i], top=42, bottom=42, left=60, right=60)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(8.0)
                r.font.bold = True
                r.font.color.rgb = RGBColor(255, 255, 255)

        for row_idx, r_data in enumerate(rows_data):
            row = table.add_row()
            bg_color = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
            for col_idx, cell_value in enumerate(r_data):
                cell = row.cells[col_idx]
                cell.width = Inches(col_widths[col_idx])
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, top=32, bottom=32, left=60, right=60)
                cell.text = str(cell_value)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.03
                for r in p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(7.5)
                    r.font.color.rgb = RGBColor(51, 65, 85)

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(0)
        p_spacer.paragraph_format.space_after = Pt(space_after)
        return table

    # =========================================================================
    # 1. TITLE & DOCUMENT CONTROL (COVER PAGE)
    # =========================================================================
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(22)
    p_pre.paragraph_format.space_after = Pt(2)
    run_pre = p_pre.add_run("PRODUCT MANAGEMENT SPECIFICATION & STRATEGIC RETROSPECTIVE")
    run_pre.font.name = "Calibri"
    run_pre.font.size = Pt(9.5)
    run_pre.font.bold = True
    run_pre.font.color.rgb = RGBColor(37, 99, 235)

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(3)
    run_title = p_title.add_run("PixelMint: Product Requirements Document")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    run_sub = p_sub.add_run("Final Recruiter-Ready PRD — Prototype Implementation Audit & Phase 1 Testnet MVP Specification")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = RGBColor(100, 116, 139)

    ctrl_headers = ["Document Metadata", "Operational Specification & Project Context"]
    ctrl_widths = [2.2, 4.9]
    ctrl_data = [
        ["Product Initiative", "PixelMint — Consumer Web3 NFT Marketplace & Creator Studio Prototype"],
        ["Document Purpose", "Product Management Retrospective & Phase 1 Scope Specification from University Capstone"],
        ["Author / Portfolio Lead", "Aditya Nair (Product Management Portfolio / Aspiring Product Manager)"],
        ["Document Baseline", "Evolved from University Capstone Engineering Document into Defensible PM Specification"],
        ["Document Status", "Final Recruiter-Ready PRD (Audited for Technical Honesty, Defensibility, and Measurable Scope)"],
        ["Codebase Architecture", "Front-End Single-Page App (React 19, TypeScript 5.9, Vite 7.2, Tailwind CSS v4)"],
        ["Implementation Truth", "Interactive Client-Side Browser State (localStorage); Zero Live Smart Contracts"],
        ["Target Audience", "Hiring Managers, Senior PM Interviewers, Cross-Functional Web3 Product Teams"]
    ]
    create_custom_table(ctrl_headers, ctrl_widths, ctrl_data, space_after=7)

    add_callout(
        "Reader's Evaluation Guide & Technical Defensibility Notice",
        "This Final PRD presents an executive-ready product management reframing of a university capstone project. "
        "The original capstone documentation was an engineering feature catalog that conflated client-side front-end UI mechanics "
        "with decentralized blockchain settlement. This document establishes complete technical defensibility: all active capabilities "
        "are audited and classified as Implemented in prototype, Simulated, Partially implemented, Not implemented, or Unverified. "
        "Fictional personas and competitive differentiators are treated as working hypotheses; early user research is disclosed as "
        "undocumented informal feedback; and the document establishes a rigorous boundary between the current simulated prototype "
        "and acceptance criteria for a proposed Phase 1 Testnet MVP.",
        bg_hex="EFF6FF",
        border_color="2563EB",
        space_after=5
    )

    add_h2("Executive Document Summary", space_before=4, space_after=2)
    add_body(
        "PixelMint was conceived as an interactive front-end prototype investigating whether consumer-grade design patterns can eliminate "
        "intimidation from the Web3 onboarding experience for independent digital artists and collectors. While the prototype successfully "
        "demonstrates end-to-end user flows (catalog filtering, item inspection, simulated wallet connection, instant checkout, minting studio, "
        "and bidding), it operates entirely through in-browser client-side state. This PRD outlines the product rationale behind that prototype, "
        "audits its technical reality, articulates a structured validation plan, and defines the scope and acceptance criteria for an authentic "
        "Phase 1 Testnet MVP on Sepolia."
    )

    doc.add_page_break()

    # =========================================================================
    # 2. EXECUTIVE SUMMARY & PRODUCT IMPLEMENTATION STATUS
    # =========================================================================
    add_h1("1. Executive Summary & Codebase Implementation Audit")
    
    add_h2("1.1 Product Definition & University Project Origin")
    add_body(
        "PixelMint is an interactive digital art marketplace and creator studio prototype designed to simplify the discovery, purchase, "
        "and tokenization of non-fungible tokens (NFTs). Originating as a university capstone project, its core objective was to explore "
        "how consumer-grade UX patterns can eliminate intimidation from the Web3 onboarding experience for independent artists and collectors."
    )
    add_body(
        "In its current state, PixelMint exists as a high-fidelity single-page web application built with React 19, TypeScript, Vite, and "
        "Tailwind CSS. The codebase provides an engaging, responsive interface simulating marketplace interactions. However, from a product "
        "governance perspective, it is critical to distinguish the prototype's client-side user experience from a production-grade decentralized application."
    )

    add_h2("1.2 Codebase Implementation Audit")
    add_body(
        "To establish rigorous technical defensibility, every core capability claimed across repository documentation was audited against the active "
        "source code (`src/`). The table below details verified mechanisms, architectural realities, and deltas required for live network readiness:"
    )

    audit_headers = ["Module / Feature", "Prototype Mechanism", "Implementation Status", "Technical Reality & Delta"]
    audit_widths = [1.4, 2.3, 1.4, 2.0]
    audit_data = [
        ["Asset Discovery & Filter", "Client-side category filtering, text search, price sort across in-memory catalog", "Implemented in prototype", "Fast client filtering over 8 mock NFTs; no server indexing or backend database."],
        ["NFT Detail & Provenance", "Dynamic routing rendering attributes, creator details, and mock history logs", "Implemented in prototype", "Displays mock attributes; history is an in-memory JSON array."],
        ["Creator Minting Studio", "Form with base64 image preview, trait builder, royalty slider (0-20%)", "Implemented in prototype", "Appends to browser localStorage; no IPFS pinning or ERC-721 contract mint."],
        ["Profile & Activity History", "Displays user-owned and created NFT collections and activity logs", "Implemented in prototype", "Pulls from browser state; does not index on-chain Transfer events."],
        ["Wallet Connection", "Modal offering MetaMask, Coinbase, Phantom; toggles boolean state flag", "Simulated", "Zero cryptographic signing; hardcoded 0x7a8b... address string and state flag."],
        ["Instant Buy Checkout", "Modal with breakdown (price + 0.0035 ETH gas); updates localStorage state", "Simulated", "Deducts mock balance; generates fake txHash; no smart contract execution."],
        ["Timed Auction Bidding", "Bid modal validating bid > current highest; updates active NFT bid array", "Simulated", "No escrow smart contract; funds are not locked; no timer trigger or block sync."],
        ["Peer-to-Peer Offers", "Offer submission modal; captures amount and duration; updates activity log", "Simulated", "Toast feedback and activity log append only; no off-chain orderbook or escrow flow."],
        ["Demo Faucet / Funds", "'Add Demo Funds' action adding +5.0 ETH to user profile balance state", "Simulated", "Local state counter in localStorage to enable user testing without financial risk."],
        ["Network Switcher", "Header dropdown (Ethereum, Polygon, Solana, Arbitrum); updates toast", "Simulated", "Visual label toggle; no multi-chain RPC bridge or chain-ID checks."],
        ["Catalog Performance", "Claimed sub-10ms filter response across 100+ assets without frame drop", "Unverified", "Catalog contains exactly 8 mock items; no load or latency benchmarks performed."],
        ["Smart Contract Badging", "Homepage stat card displaying 'Smart Contracts: 100% Audited'", "Misleading (Flagged)", "No smart contracts exist; zero security audits ever conducted."],
        ["AI Description Tool", "Early concept ideation for auto-generating artwork descriptions", "Not implemented", "Deferred to future roadmap; zero code exists in repository."]
    ]
    create_custom_table(audit_headers, audit_widths, audit_data, space_after=4)

    add_h2("1.3 Deceptive UI Disclosures & Prototype Remediation Plan")
    add_body(
        "A critical responsibility of product management is ensuring user trust and ethical design. The codebase audit revealed three "
        "areas where the current prototype UI risks misleading evaluators or test users:"
    )
    add_bullet(
        "The homepage displays a stat card claiming '100% Audited'. Because the application does not deploy live smart contracts "
        "and has never undergone an independent security audit (e.g., OpenZeppelin, Trail of Bits), this badge is objectively false. "
        "Action: Remove this badge immediately in the next UI release and replace it with an honest 'Interactive Prototype Sandbox' banner.",
        bold_prefix="1. Remediation of '100% Audited' Claim: "
    )
    add_bullet(
        "The homepage counter displaying '4,850+ Verified Artists' and dynamic marketplace volume totals are hardcoded mock values. They must be "
        "treated strictly as simulated visual demonstrations, not validated product traction or commercial KPIs.",
        bold_prefix="2. Simulated Market Data: "
    )
    add_bullet(
        "Checkout displays a fixed gas fee of 0.0035 ETH, and minting displays a fixed gas cost of 0.012 ETH. These are static demo constants "
        "hardcoded in React state, not dynamic gas estimations querying an EIP-1559 base fee oracle.",
        bold_prefix="3. Fixed Gas Estimates: "
    )

    # =========================================================================
    # 3. PROBLEM FRAMING, MARKET CONTEXT, & RESEARCH REALITIES
    # =========================================================================
    add_h1("2. Problem Framing, Market Context, & Research Realities")

    add_h2("2.1 Problem Statement & Industry Friction")
    add_body(
        "The promise of decentralized digital ownership is undermined by extreme usability friction in the mainstream consumer funnel. "
        "While crypto-native users navigate multi-step wallet approvals and volatile network fees, independent artists "
        "and casual art collectors face substantial cognitive and financial barriers across three core friction dimensions:"
    )
    add_bullet(
        "First-time buyers frequently abandon checkout when confronted with unexpected, variable gas fees that are not displayed until "
        "the final browser extension confirmation popup. This lack of upfront itemized pricing creates distrust and high drop-off.",
        bold_prefix="A. Unpredictable & Opaque Transaction Costs: "
    )
    add_bullet(
        "Mandatory browser extensions, 12-word seed phrase custodianship, and cryptographic jargon (e.g., RPC endpoints, gas limits) "
        "intimidate non-technical creators who simply want to publish and monetize their artwork.",
        bold_prefix="B. Intimidating Technical Onboarding: "
    )
    add_bullet(
        "Platforms frequently obscure creator royalty enforcement policies, contract authenticity, and provenance history. Collectors "
        "struggle to verify genuine artist attribution, while creators fear secondary resale royalties will be arbitrarily stripped.",
        bold_prefix="C. Trust & Provenance Ambiguity: "
    )

    add_h2("2.2 Research Reality Disclosure & Evidence Limitations")
    add_callout(
        "Empirical Evidence Disclosure: Undocumented Informal Feedback",
        "Early exploratory feedback for PixelMint was gathered through undocumented, informal prototype walkthroughs with university peers "
        "during initial project development. Because no formal interview protocols, participant screening records, or structured qualitative "
        "session transcripts were recorded, specific participant counts, demographic segmentations, and reported findings cannot be empirically verified. "
        "This feedback must be treated strictly as undocumented informal feedback providing anecdotal directional signals rather than validated "
        "user research. Consequently, all problem statements, persona goals, and market assumptions in this PRD are formally treated as "
        "unvalidated working hypotheses requiring structured discovery in upcoming research sprints.",
        bg_hex="FFFBEB",
        border_color="D97706",
        space_after=4
    )

    add_h2("2.3 Competitive Landscape & Strategic Differentiation Hypotheses")
    add_body(
        "Rather than asserting unverified factual claims regarding competitor operations, PixelMint evaluates the market through testable "
        "differentiation hypotheses based on industry observations and publicly documented marketplace dynamics:"
    )

    comp_headers = ["Platform Archetype", "Observed Market Pattern", "Hypothesized User Pain Point", "PixelMint Differentiation Hypothesis"]
    comp_widths = [1.5, 1.8, 1.8, 2.0]
    comp_data = [
        ["OpenSea\n(High-Liquidity Leader)", "Massive catalog, multi-chain aggregation, self-service creator studio.", "Interface visual clutter; variable gas spikes at checkout; deprioritized creator royalties (made optional in Aug 2023).", "Educational clarity; upfront total checkout cost calculation; locked creator royalty attribution."],
        ["Foundation / SuperRare\n(Curated Fine Art)", "High aesthetic standards, historically curated or invite-only creator onboarding.", "Exclusionary onboarding barrier for emerging creators; high initial minting gas barriers.", "Open self-service creator studio paired with a curated, glassmorphism browsing aesthetic."],
        ["Magic Eden\n(Multi-Chain Gaming/NFT)", "Rapid transaction execution, multi-chain emphasis (Solana, Bitcoin, EVM).", "Trading-terminal density intimidates casual non-crypto art collectors.", "Consumer-friendly, single-column checkout modal with built-in educational tooltips."]
    ]
    create_custom_table(comp_headers, comp_widths, comp_data, space_after=4)

    add_h2("2.4 Riskiest Assumptions Requiring Validation")
    add_bullet("We assume independent creators prioritize upfront fee clarity over immediate marketplace liquidity. (Risk: High)", bold_prefix="Assumption 1: ")
    add_bullet("We assume casual buyers will complete purchases if network gas is itemized upfront before wallet connection. (Risk: High)", bold_prefix="Assumption 2: ")
    add_bullet("We assume simulated sandbox faucets build user confidence rather than trivializing perceived asset value. (Risk: Medium)", bold_prefix="Assumption 3: ")
    add_bullet("We assume creators will willingly pay modest minting gas if secondary royalties are signaled via on-chain standards. (Risk: Medium)", bold_prefix="Assumption 4: ")

    # =========================================================================
    # 4. TARGET USERS, PROTO-PERSONAS, & JOBS TO BE DONE
    # =========================================================================
    add_h1("3. Target Users, Proto-Personas, & Jobs to be Done")

    add_h2("3.1 Target User Segmentation")
    add_body(
        "PixelMint addresses a dual-sided marketplace consisting of independent digital creators and casual digital collectors, supported "
        "by a secondary segment of Web3 explorers. To ground product requirements without inventing demographic telemetry, we define three "
        "concise proto-personas. These personas represent working behavioral hypotheses to be refined through structured qualitative interviews."
    )

    add_h2("3.2 Proto-Personas (Working Behavioral Hypotheses)")
    add_bullet("27-year-old freelance 2D illustrator; highly proficient in Procreate/Photoshop; zero coding or Web3 knowledge. Needs a guided upload-to-mint studio explaining gas costs in plain currency and guaranteeing permanent royalty tagging.", bold_prefix="Elena Rostova (Independent Digital Creator — Primary): ")
    add_bullet("32-year-old technology professional; holds modest cryptocurrency balances; appreciates digital art and design aesthetics. Frustrated by surprise gas spikes at final wallet signing; values transparent, itemized checkout displaying total cost upfront.", bold_prefix="Marcus Vance (Casual Art Collector — Primary): ")
    add_bullet("23-year-old design student; curious about digital ownership but fears losing funds through wallet misconfigurations or scams. Values a risk-free sandbox environment with demo faucet funds to learn minting and buying before committing capital.", bold_prefix="Sophia Lin (Web3 Explorer / Cautious Novice — Secondary): ")

    add_h2("3.3 Jobs-to-be-Done (JTBD) Framework")
    jtbd_headers = ["User Role", "Job to be Done (JTBD) Statement", "Target Emotional Outcome", "Current Prototype Mechanism"]
    jtbd_widths = [1.3, 3.2, 1.3, 1.3]
    jtbd_data = [
        ["Creator\n(Elena)", "When I finish an original digital artwork, I want to tokenize and list it with transparent fees and locked royalties, so that I can establish provenance and earn recurring revenue without technical barriers.", "Confidence, creative agency, financial security", "Guided studio form with trait builder and Base64 preview."],
        ["Buyer\n(Marcus)", "When I find a compelling piece of digital art, I want to inspect its provenance and execute an instant purchase with total cost clarity, so that I never encounter surprise checkout fees or transaction failure.", "Clarity, trust, effortless acquisition", "Instant checkout modal itemizing price and gas fee."],
        ["Explorer\n(Sophia)", "When I explore Web3 digital collectibles for the first time, I want to simulate transactions using demo funds in a sandbox, so that I can master marketplace mechanics without financial anxiety.", "Curiosity, psychological safety, education", "One-click 'Add Funds' faucet granting +5.0 test ETH."]
    ]
    create_custom_table(jtbd_headers, jtbd_widths, jtbd_data, space_after=4)

    # =========================================================================
    # 5. PRODUCT VISION, PRINCIPLES, GOALS, & PROPOSED METRICS
    # =========================================================================
    add_h1("4. Product Vision, Principles, Goals, & Proposed Metrics")

    add_h2("4.1 Product Vision & Guiding Principles")
    add_body(
        "Vision: To make digital asset ownership and monetization transparent, accessible, and psychologically safe for independent creators "
        "and collectors, establishing a consumer standard where decentralized mechanics feel as seamless as traditional digital commerce."
    )
    add_bullet("Network gas estimates, marketplace fees, and royalty splits must be calculated and displayed upfront prior to transaction initiation.", bold_prefix="1. Radical Price Transparency: ")
    add_bullet("Replace obscure hash strings and protocol parameters with clear contextual explanations and human-readable status indicators.", bold_prefix="2. Empathy Over Protocol Jargon: ")
    add_bullet("Creator royalties are non-negotiable compensation for creative labor; platform architecture must enforce on-platform royalties and implement EIP-2981.", bold_prefix="3. Creator Royalty Integrity: ")
    add_bullet("Never display unverified audit badges, fictitious volume statistics, or simulated confirmations disguised as live blockchain finality.", bold_prefix="4. Uncompromising System Honesty: ")

    add_h2("4.2 Separating Product Outcomes from Functional Outputs")
    add_body(
        "Product success is measured by user behavior change and friction elimination, not by the count of UI components shipped. "
        "While shipping a minting form is an engineering output, achieving an unassisted mint completion rate >= 75% in user tests is the true product outcome."
    )

    add_h2("4.3 Proposed Metrics Framework & Target Rationale")
    add_body(
        "Because PixelMint is currently an un-instrumented front-end prototype, all current baselines are explicitly recorded as 'Not available'. "
        "Rather than setting arbitrary targets, every provisional target below includes an explicit operational rationale based on standard usability benchmarks:"
    )

    metric_headers = ["Metric Name", "Category", "Operational Definition & Measurement", "Baseline", "Target & Explicit Rationale"]
    metric_widths = [1.4, 1.0, 2.3, 0.9, 1.5]
    metric_data = [
        ["Creator Mint Completion Rate", "Funnel Efficiency", "Percentage of creators initiating studio flow who complete minting. (Mints Completed / Starts * 100)", "Not available (Prototype)", ">= 75% in lab tests. Rationale: Self-service creator SaaS averages 60-70%; 75% tests whether single-page studio removes metadata drop-off."],
        ["Checkout Abandonment Rate", "UX Friction", "Percentage of buyers opening Buy Modal who abandon without confirming. (Abandons / Views * 100)", "Not available (Prototype)", "<= 25% modal drop-off. Rationale: E-commerce cart abandonment averages ~70% (Baymard); 25% tests if upfront gas itemization stops fee shock."],
        ["Fee Comprehension Score", "Trust & Clarity", "Post-checkout subjective score: 'I clearly understood the total cost before signing' on 1-5 Likert scale.", "Not available (Prototype)", ">= 4.0 / 5.0 in lab cohorts. Rationale: Standard UX threshold indicating high cognitive clarity with minimal post-transaction regret."],
        ["Sandbox Faucet Engagement", "Onboarding", "Percentage of newly connected sessions that utilize the demo faucet before attempting a buy or mint action.", "Not available (Prototype)", "Target TBD. Rationale: Faucet is an exploratory feature; optimal baseline must be determined empirically from initial user cohorts."],
        ["Unassisted Task Success", "Usability", "Percentage of first-time test participants completing discovery-to-purchase flow without moderator intervention.", "Not available (Prototype)", ">= 80% task completion. Rationale: Sauro & Lewis benchmark for core software workflows in formative usability testing."]
    ]
    create_custom_table(metric_headers, metric_widths, metric_data, space_after=4)

    # =========================================================================
    # 6. CORE USER JOURNEYS (BUYER & CREATOR)
    # =========================================================================
    add_h1("5. Core User Journeys (Buyer & Creator)")

    add_h2("5.1 Journey Architecture & Separation Rationale")
    add_body(
        "In a two-sided digital asset marketplace, buyers and creators have fundamentally distinct mental models, value drivers, and risk thresholds. "
        "PixelMint establishes two dedicated primary journeys to ensure optimized funnel design without combining conflicting user steps."
    )

    add_h2("5.2 Primary Buyer Journey: Discovery to Purchase Simulation")
    buyer_headers = ["Stage", "User Goal & Mindset", "Prototype Interaction Flow", "Current Prototype Status", "Live Production Delta"]
    buyer_widths = [1.1, 1.6, 2.0, 1.1, 1.3]
    buyer_data = [
        ["1. Discover", "Find high-quality artwork matching personal taste and budget.", "Lands on Explore page; filters by category ('Art'); applies search keyword; sorts by price.", "Implemented in prototype", "Filters static mock JSON; production requires GraphQL indexer."],
        ["2. Inspect", "Evaluate aesthetic quality, creator reputation, and ownership history.", "Clicks NFT card; inspects high-res asset, trait badges, creator bio, and historical activity log.", "Implemented in prototype", "Displays mock attributes; production requires on-chain contract events."],
        ["3. Handshake", "Establish identity to enable transaction authorization.", "Clicks 'Buy Now'; if disconnected, Wallet Modal prompts provider selection (MetaMask, Coinbase).", "Simulated", "Sets local boolean flag; production requires wagmi Web3 provider."],
        ["4. Review", "Verify total financial commitment with zero hidden fees.", "Instant Checkout modal opens; items: Base Price + 0.0035 ETH gas = Total Cost; checks balance.", "Simulated", "Calculates static gas; production queries EIP-1559 gas oracle."],
        ["5. Settle", "Execute payment and assume verifiable ownership.", "Clicks 'Confirm Purchase'; simulated spinner (1.2s); fake txHash; ownership state updates to user.", "Simulated", "Updates localStorage; production executes ERC-721 buy() contract call."]
    ]
    create_custom_table(buyer_headers, buyer_widths, buyer_data, space_after=4)

    add_h2("5.3 Primary Creator Journey: Creation to Mint & Listing Simulation")
    creator_headers = ["Stage", "Creator Goal & Mindset", "Prototype Interaction Flow", "Current Prototype Status", "Live Production Delta"]
    creator_widths = [1.1, 1.6, 2.0, 1.1, 1.3]
    creator_data = [
        ["1. Stage", "Upload original high-res creative asset effortlessly.", "Navigates to Create Studio; drags & drops image (PNG/JPG); Base64 FileReader renders instant preview.", "Implemented in prototype", "Local browser memory; production pins file to decentralized IPFS."],
        ["2. Metadata", "Define artwork identity, context, and collectible traits.", "Enters title, description, category; adds custom key-value attributes (e.g., 'Series: Genesis').", "Implemented in prototype", "Form state binding; production formats ERC-721 metadata JSON."],
        ["3. Economics", "Set listing valuation and secure secondary royalties.", "Specifies price in ETH; sets royalty slider (0-20%); selects format (Fixed Price vs Timed Auction).", "Implemented in prototype", "Binds to payload; production encodes EIP-2981 royalty interface."],
        ["4. Authorize", "Acknowledge network gas cost and authorize minting.", "Studio displays estimated minting cost (~0.012 ETH); checks wallet funds; clicks 'Mint NFT'.", "Simulated", "Validates mock balance; production prompts MetaMask gas signature."],
        ["5. Publish", "Verify active marketplace indexing and share asset link.", "Simulated minting delay (800ms); success modal displays minted card; options to view or mint another.", "Simulated", "Pushes to localStorage; production waits for block confirmation."]
    ]
    create_custom_table(creator_headers, creator_widths, creator_data, space_after=4)

    add_h2("5.4 Journey Friction Points & Simulation Realities")
    add_bullet("In the prototype, minting completes in 800ms via local memory. On live networks, block confirmation requires 12 to 30 seconds, during which users experience anxiety if progress feedback is absent.", bold_prefix="Settlement Latency Masking: ")
    add_bullet("The prototype utilizes fixed gas fees (0.0035 ETH buy, 0.012 ETH mint). On live networks, EIP-1559 base fee spikes can cause transactions to fail or cost substantially more, requiring dynamic slippage buffers.", bold_prefix="Gas Volatility Masking: ")

    # =========================================================================
    # 7. SCOPE BOUNDARIES & HORIZON ARCHITECTURE
    # =========================================================================
    add_h1("6. Scope Boundaries & Horizon Architecture")

    add_h2("6.1 Horizon Scope Boundaries")
    add_bullet("Active React single-page app validating UI layout, mental models, information architecture, and fee presentation before writing smart contracts.", bold_prefix="Horizon 0: Current Interactive Prototype (Active Baseline) — ")
    add_bullet("Minimum viable decentralized app on Sepolia testnet integrating live Web3 wallets (wagmi/viem), ERC-721 contracts, IPFS media pinning, and testnet faucet tokens.", bold_prefix="Horizon 1: Proposed Testnet MVP (Next Validation Increment) — ")
    add_bullet("Commercial deployment on a low-fee Ethereum Layer-2 rollup (Base or Arbitrum) with legal terms of service, creator verification, and pHash copyright protection.", bold_prefix="Horizon 2: Production L2 Marketplace (Commercial Release) — ")

    add_h2("6.2 In-Scope Capabilities: Prototype vs. Proposed Testnet MVP")
    scope_headers = ["Functional Capability", "Current Interactive Prototype (H0)", "Proposed Testnet MVP (H1)", "Strategic Scope Rationale"]
    scope_widths = [1.6, 1.8, 1.8, 1.9]
    scope_data = [
        ["Asset Catalog & Search", "In-memory client-side filter over 8 mock NFTs.", "Lightweight Node/PostgreSQL catalog indexing testnet contract events.", "Instant catalog search without waiting for slow direct blockchain queries."],
        ["Wallet Connection", "Mock modal setting local boolean flag (`walletConnected`).", "Live browser wallet integration using wagmi / RainbowKit / viem.", "Enables real cryptographic address verification and transaction signing."],
        ["Asset Media Storage", "Browser Base64 DataURL stored in localStorage.", "Decentralized IPFS media pinning via Pinata / Web3.Storage API.", "Ensures tamper-proof, decentralized storage of creator art files."],
        ["Token Minting", "Appends mock NFT object to localStorage array.", "ERC-721 smart contract deployment on Sepolia with EIP-2981 royalties.", "Establishes true immutable blockchain ownership and provenance on testnet."],
        ["Checkout & Purchase", "Simulated modal deducting mock ETH balance.", "Atomic smart contract purchase function with automated escrow transfer.", "Validates live fund transfers, gas fee execution, and ownership transfer."],
        ["Gas Estimation", "Static constants (0.0035 ETH buy, 0.012 ETH mint).", "Real-time RPC gas estimation using current base fee + priority tip.", "Provides authentic fee transparency based on real network congestion."]
    ]
    create_custom_table(scope_headers, scope_widths, scope_data, space_after=4)

    add_h2("6.3 Deliberate Exclusions & Non-Goals")
    add_bullet("PixelMint will not process real monetary transactions on Ethereum mainnet until usability, security audits, and legal compliance are established.", bold_prefix="1. Mainnet Financial Deployment: ")
    add_bullet("While ideated in early notes, automated generative AI text assistants add distraction from core marketplace mechanics and are deferred.", bold_prefix="2. AI-Generated NFT Descriptions: ")
    add_bullet("Credit card processing and custodial fiat wallets introduce complex KYC/AML banking requirements that are deferred to commercial phases.", bold_prefix="3. Fiat On-Ramp / Stripe Integration: ")
    add_bullet("Bridging assets across disparate chains introduces extreme smart contract bridge vulnerability and is excluded.", bold_prefix="4. Multi-Chain Cross-Rollup Bridging: ")

    # =========================================================================
    # 8. PRIORITIZED REQUIREMENTS & SEPARATE ACCEPTANCE CRITERIA
    # =========================================================================
    add_h1("7. Prioritized Requirements & Separate Acceptance Criteria")

    add_h2("7.1 MoSCoW Prioritization Across Product Horizons")
    moscow_headers = ["Capability / Feature", "User Value", "MoSCoW Priority", "Current Prototype Status", "Horizon Allocation"]
    moscow_widths = [1.5, 1.7, 1.1, 1.3, 1.5]
    moscow_data = [
        ["Catalog Search & Filtering", "Enables intuitive discovery across art categories.", "Must Have", "Implemented in prototype", "Horizon 0 (Prototype) & H1 (Testnet)"],
        ["Transparent Buy Checkout", "Eliminates surprise checkout fees via itemized breakdown.", "Must Have", "Simulated", "Horizon 0 (Prototype) & H1 (Testnet)"],
        ["Guided Minting Studio", "Provides foolproof artwork upload and trait configuration.", "Must Have", "Implemented in prototype", "Horizon 0 (Prototype) & H1 (Testnet)"],
        ["Wallet Connection State", "Provides session identity and balance verification.", "Must Have", "Simulated", "Horizon 0 (Prototype) & H1 (Testnet)"],
        ["Demo Faucet / Funds", "Enables risk-free transaction testing for novices.", "Must Have", "Simulated", "Horizon 0 (Prototype) & H1 (Testnet)"],
        ["Timed Auction Bidding", "Enables market price discovery on rare 1-of-1 assets.", "Should Have", "Simulated", "Horizon 1 (Post-MVP Testnet)"],
        ["Peer-to-Peer Offers", "Allows negotiable liquidity on unlisted or high-value items.", "Should Have", "Simulated", "Horizon 1 (Post-MVP Testnet)"],
        ["Profile & Activity History", "Displays ownership collection and audit provenance.", "Should Have", "Implemented in prototype", "Horizon 0 (Prototype) & H1 (Testnet)"],
        ["Multi-Network UI Switcher", "Visual preview of multi-chain flexibility.", "Could Have", "Simulated", "Horizon 2 (L2 Multi-Network)"],
        ["AI Description Generator", "Assists creators with creative writing blocks.", "Could Have", "Not implemented", "Horizon 3 (Creator Scale)"],
        ["Fiat Credit Card Checkout", "Lowers barrier for users without crypto wallets.", "Won't Have (MVP)", "Not implemented", "Horizon 2 (Commercial L2)"],
        ["Smart Contract Audit Badge", "Communicates third-party protocol verification.", "Won't Have (until audited)", "Misleading (Flagged)", "Horizon 2 (Post-Independent Audit)"]
    ]
    create_custom_table(moscow_headers, moscow_widths, moscow_data, space_after=4)

    add_h2("7.2 Requirements for Current Simulated Front-End Prototype (Horizon 0)")
    add_body(
        "The current prototype codebase implements a client-side single-page application. The functional requirements below define the "
        "operational behavior of the prototype as currently implemented or simulated in the browser:"
    )

    proto_headers = ["Req ID & Name", "User Story & Description", "Prototype Operational Behavior & UI State", "Status in Codebase"]
    proto_widths = [1.3, 2.0, 2.6, 1.2]
    proto_data = [
        ["FR-P01: Catalog Search & Filter", "As a buyer, I want to filter and search NFTs so that I can quickly locate desired artwork.", "Filters in-memory `nfts` array by category, search text, and price sort; updates grid reactively; displays empty state if 0 matches.", "Implemented in prototype"],
        ["FR-P02: Item Provenance Display", "As a buyer, I want to inspect item details so that I can evaluate creator traits and history.", "Routes to dynamic detail page; displays high-res asset, trait pills, creator details, price, and chronological mock history array.", "Implemented in prototype"],
        ["FR-P03: Studio Asset Upload", "As a creator, I want to upload artwork files so that I can immediately preview my token.", "Drag-and-drop file input reads file via FileReader Base64 DataURL; immediately renders preview in studio canvas.", "Implemented in prototype"],
        ["FR-P04: Trait Builder & Metadata", "As a creator, I want to add custom metadata traits so that my NFT has structured rarity.", "Provides dynamic key-value input rows; creator can add, edit, or delete traits; binds to form state for submission.", "Implemented in prototype"],
        ["FR-P05: Simulated Wallet Handshake", "As a user, I want to connect a wallet so that I can authorize prototype actions.", "Modal displays MetaMask, Coinbase, Phantom; clicking provider sets `walletConnected=true`, assigns mock address and balance.", "Simulated in prototype"],
        ["FR-P06: Simulated Checkout Flow", "As a buyer, I want to see an itemized fee breakdown before purchasing an NFT.", "Modal displays Base Price, static Gas Fee (0.0035 ETH), and Total Cost; checks balance; confirms via simulated 1.2s timeout.", "Simulated in prototype"],
        ["FR-P07: Demo Faucet (+5 ETH)", "As a test user, I want to add demo funds so that I can test buying without financial risk.", "Clicking 'Add Funds' in profile or checkout increments `user.balance` by +5.0 ETH and syncs synchronously to localStorage.", "Simulated in prototype"],
        ["FR-P08: Simulated Bidding & Offers", "As a collector, I want to place bids and make offers on listed digital artwork.", "Bid modal validates bid > current; updates active NFT bid array; offer modal captures amount/duration and logs activity toast.", "Simulated in prototype"]
    ]
    create_custom_table(proto_headers, proto_widths, proto_data, space_after=4)

    add_h2("7.3 Acceptance Criteria for Proposed Testnet MVP (Horizon 1 — Sepolia)")
    add_body(
        "To advance from the simulated prototype to an authentic decentralized application, the proposed Testnet MVP must satisfy the following "
        "rigorous Given / When / Then acceptance criteria under live smart contract execution on Sepolia testnet:"
    )

    mvp_headers = ["AC ID & Capability", "Testnet User Story", "Acceptance Criteria (Given / When / Then)", "Target Infrastructure"]
    mvp_widths = [1.3, 1.8, 2.7, 1.3]
    mvp_data = [
        ["AC-MVP-01: Cryptographic Wallet Connection", "As a user, I want to connect my actual Web3 wallet so that I can cryptographically sign testnet transactions.", "Given a user with a Web3 wallet (MetaMask/Rainbow), When user connects, Then app requests chain ID (Sepolia: 11155111); prompts chain switch if wrong; reads real Sepolia ETH balance via RPC.", "wagmi / viem / Sepolia RPC"],
        ["AC-MVP-02: Decentralized Media Pinning", "As a creator, I want my artwork and metadata permanently pinned so that asset provenance cannot be altered.", "Given an uploaded image file, When creator initiates minting, Then file is pinned to IPFS via Pinata; returns CID; formats ERC-721 metadata JSON including EIP-2981 royalty specification.", "Pinata IPFS / Decentralized Gateway"],
        ["AC-MVP-03: Testnet ERC-721 Contract Mint", "As a creator, I want to execute a real smart contract mint so that my NFT is permanently recorded on-chain.", "Given pinned IPFS metadata, When creator clicks 'Mint', Then triggers `mintTo(creator, tokenURI)` on Sepolia contract; prompts wallet signature; displays pending toast; confirms upon block inclusion.", "Solidity ERC-721 / OpenZeppelin"],
        ["AC-MVP-04: Atomic Marketplace Purchase", "As a buyer, I want to execute an on-chain purchase so that funds and ownership transfer atomically.", "Given a listed NFT on Sepolia, When buyer confirms purchase, Then smart contract executes atomic swap; routes sale price to seller, enforces platform fee, and updates ERC-721 owner.", "Marketplace Escrow Contract"],
        ["AC-MVP-05: Dynamic Gas Fee Estimation", "As a buyer, I want real-time gas calculations so that I never experience unexpected transaction cost spikes.", "Given checkout initiated, When modal loads, Then queries Sepolia base fee + priority fee via EIP-1559 oracle; displays itemized fee in Sepolia ETH and fiat equivalent with 10% buffer.", "Alchemy / Infura EIP-1559 Oracle"],
        ["AC-MVP-06: Verifiable Provenance Logging", "As a collector, I want to verify on-chain history so that I can prove the authenticity of my acquisition.", "Given detail page rendered, When history loads, Then queries contract `Transfer` and `RoyaltyPaid` events; renders verifiable block explorer links (Sepolia Etherscan) for each txHash.", "The Graph Subgraph / Etherscan API"]
    ]
    create_custom_table(mvp_headers, mvp_widths, mvp_data, space_after=4)

    add_h2("7.4 Prototype Error Handling & Edge State Behaviors")
    add_bullet("If a buyer's balance is less than `Item Price + Gas Fee`, the checkout modal disables the primary action, highlights the balance in red, and displays an inline 'Add Demo Funds' button to resolve the deficit instantly.", bold_prefix="Insufficient Funds Edge Case: ")
    add_bullet("If a creator attempts to submit the studio form with missing fields or an unselected image, field-level red validation borders appear with explicit text prompts; the form prevents submission until all errors are cleared.", bold_prefix="Form Incomplete Validation: ")
    add_bullet("If browser `localStorage` contains corrupted JSON, the application catches the parsing exception, falls back gracefully to default mock data in `mockData.ts`, and logs an error without crashing the React component tree.", bold_prefix="Corrupted LocalStorage Recovery: ")

    # =========================================================================
    # 9. NON-FUNCTIONAL REQUIREMENTS, TECHNICAL HONESTY & RISK GOVERNANCE
    # =========================================================================
    add_h1("8. Non-Functional Requirements, Technical Honesty & Risk Governance")

    add_h2("8.1 Non-Functional Requirements (NFRs) & Performance Verification")
    nfr_headers = ["Dimension", "Specific NFR Target / Requirement", "Prototype Implementation Status", "Verification Method"]
    nfr_widths = [1.4, 2.7, 1.5, 1.5]
    nfr_data = [
        ["Client Performance", "Catalog search and filter operations must execute in < 50ms across 100+ items without frame drop.", "Unverified (Prototype carries 8 mock items; no load or latency benchmarks performed)", "Synthetic 100+ item performance profiling in Chrome DevTools required."],
        ["Usability & Contrast", "WCAG 2.1 AA compliance: all text on glassmorphism dark surfaces must maintain >= 4.5:1 contrast ratio.", "Unverified / Partially Compliant (text-gray-400 on dark glass requires formal audit)", "Automated Lighthouse & Axe accessibility audits required."],
        ["State Resilience", "User actions (mints, buys, likes) must persist across browser tab refreshes without data loss.", "Implemented in prototype (via synchronous browser localStorage serialization)", "Manual end-to-end refresh persistence testing."],
        ["Responsive Layout", "Seamless visual hierarchy across mobile (375px), tablet (768px), and desktop (1280px+).", "Implemented in prototype (Tailwind responsive grid and mobile navigation drawer)", "Multi-device viewport testing in Chrome DevTools."]
    ]
    create_custom_table(nfr_headers, nfr_widths, nfr_data, space_after=4)

    add_h2("8.2 Technical Honesty: Architectural Realities & Contradiction Resolution")
    add_callout(
        "Technical Governance Mandate: Architectural Honesty",
        "To establish rigorous defensibility, PixelMint explicitly documents the operational boundaries between client-side simulation, "
        "testnet infrastructure, and live multi-chain settlement, resolving core Web3 misconceptions across royalties and network fees.",
        bg_hex="FEF2F2",
        border_color="EF4444",
        space_after=3.5
    )
    add_bullet(
        "The EIP-2981 standard provides an on-chain interface signaling royalty recipients and basis points, but it does NOT enforce payment "
        "across external marketplaces. Platforms can bypass secondary royalties unless an operator filter registry is deployed (which introduces "
        "centralization trade-offs). PixelMint guarantees royalties on its native smart contract and signals EIP-2981 universally, but acknowledges "
        "that off-platform secondary royalty enforcement remains an unresolved industry challenge.",
        bold_prefix="1. Secondary Royalty Enforcement Reality: "
    )
    add_bullet(
        "Deploying on Layer-2 rollups (e.g., Base, Arbitrum) significantly mitigates execution gas costs compared to Ethereum mainnet (reducing fees "
        "from tens of dollars to modest cents). However, Layer-2 does NOT make gas concerns 'disappear' or 'obsolete'. Users still encounter base fee "
        "spikes during network congestion, L1 calldata settlement costs, bridge transfer friction, and multi-network wallet switching overhead.",
        bold_prefix="2. Layer-2 Rollup Economic Realities: "
    )
    add_bullet(
        "In the prototype checkout modal, gas is hardcoded at 0.0035 ETH ($12.08) and minting at 0.012 ETH ($41.40). These are static visual placeholders. "
        "The Testnet MVP will query live EIP-1559 base fee oracles to calculate authentic, dynamic gas estimates with a 10% slippage buffer.",
        bold_prefix="3. Simulated Gas Estimations vs. Live Oracles: "
    )

    add_h2("8.3 Risk Assessment & Mitigation Matrix", space_before=5.0)
    risk_headers = ["Identified Risk", "Severity & Likelihood", "Product Impact", "Mitigation Strategy & PM Action"]
    risk_widths = [1.6, 1.4, 1.8, 2.3]
    risk_data = [
        ["Deceptive Badging Backlash", "High Severity\nHigh Likelihood", "Users or evaluators discover '100% Audited' badge is fictitious, destroying trust.", "Immediately deprecate badge in UI; replace with transparent 'Prototype Sandbox' banner."],
        ["Art Plagiarism / Copyright Infringement", "High Severity\nMedium Likelihood", "Bad actors mint artwork they do not own, exposing marketplace to copyright liability.", "Implement perceptual hashing (pHash) against known creative registries before mint authorization."],
        ["Gas Price Volatility Abandonment", "Medium Severity\nHigh Likelihood", "Spikes in Layer-1 Ethereum gas cause users to abandon checkout flows.", "Deploy Testnet and Production MVPs on Layer-2 rollups with dynamic gas estimation and slippage buffers."],
        ["Private Key Loss & User Frustration", "High Severity\nMedium Likelihood", "Non-technical users lose access to crypto wallets and blame the platform.", "Phase 2 roadmap incorporates Social Login (Account Abstraction via ERC-4337) to eliminate seed phrases."]
    ]
    create_custom_table(risk_headers, risk_widths, risk_data, space_after=4)

    # =========================================================================
    # 10. MEASUREMENT & VALIDATION PLAN
    # =========================================================================
    add_h1("9. Measurement & Validation Plan")

    add_h2("9.1 Validation Strategy & Learning Goals")
    add_body(
        "Because PixelMint currently lacks quantitative production telemetry and has only undergone undocumented informal peer feedback, "
        "the immediate product priority is validating foundational user assumptions through low-cost, high-signal discovery before "
        "writing production smart contracts. The objective is to establish empirical truth regarding user friction."
    )

    add_h2("9.2 Planned Research Sprints")
    add_bullet("N = 8 participants (4 independent digital illustrators; 4 digital art collectors / crypto-curious buyers). Moderated 45-minute remote think-aloud usability sessions evaluating the upload-to-mint studio and checkout fee comprehension. Core Metric: Unassisted Task Success Rate.", bold_prefix="Sprint 1: Qualitative Usability Lab (Think-Aloud Protocols) — ")
    add_bullet("N = 20 prospective buyers recruited from digital art communities. A/B testing Variant A (Itemized: Price + Gas = Total) vs. Variant B (All-Inclusive Single Price with Gas Absorbed). Decision Metric: Subjective price comprehension and willingness-to-proceed.", bold_prefix="Sprint 2: Checkout Fee Presentation Experiment — ")

    add_h2("9.3 Participant Recruitment & Screener Criteria")
    screen_headers = ["Segment", "Mandatory Inclusion Criteria", "Disqualification Criteria", "Primary Learning Focus"]
    screen_widths = [1.3, 2.3, 1.8, 1.7]
    screen_data = [
        ["Creators\n(Elena Archetype)", "Active digital artist (2D/3D); has sold digital art or prints in past 12 months; non-crypto native.", "Professional Solidity/Web3 developers; creators with existing high-volume NFT collections.", "Clarity of trait builder, royalty comprehension, and gas fee acceptance."],
        ["Collectors\n(Marcus Archetype)", "Has purchased digital art, prints, or gaming collectibles; owns basic crypto wallet or interested in owning.", "High-frequency crypto traders focused solely on token financial speculation.", "Checkout fee transparency, provenance readability, and trust signals."]
    ]
    create_custom_table(screen_headers, screen_widths, screen_data, space_after=4)

    add_h2("9.4 Decision Triggers: What Evidence Would Change Our Product Decisions")
    add_bullet("If >= 40% of tested creators fail to understand or use the trait key-value builder, we will remove manual trait configuration and replace it with automated preset category tags.", bold_prefix="Trigger 1: Trait Builder Simplification: ")
    add_bullet("If >= 50% of buyers express anxiety regarding gas fee fluctuations during checkout, we will deploy on Layer-2 rollups with sponsored gas (Biconomy / ERC-4337 account abstraction).", bold_prefix="Trigger 2: Gasless Architecture Pivot: ")
    add_bullet("If >= 60% of creators state they will not mint digital assets without an immediate fiat off-ramp (bank transfer), we will reprioritize Stripe Connect / MoonPay integrations ahead of multi-chain auction features.", bold_prefix="Trigger 3: Fiat Off-Ramp Prioritization: ")

    # =========================================================================
    # 11. ASSUMPTIONS, OPEN QUESTIONS, ROADMAP & PM RETROSPECTIVE
    # =========================================================================
    add_h1("10. Assumptions, Open Questions, Roadmap & PM Retrospective")

    add_h2("10.1 Key Assumptions Log")
    add_bullet("We assume independent creators value permanent royalty attribution enough to overcome initial minting learning curves.", bold_prefix="A-01 (User): ")
    add_bullet("We assume casual collectors prefer a clean, curated marketplace layout over trading-terminal data density.", bold_prefix="A-02 (User): ")
    add_bullet("We assume Ethereum Layer-2 rollups (Base/Arbitrum) provide sufficient security trust while substantially lowering unit gas costs.", bold_prefix="A-03 (Technical): ")
    add_bullet("We assume decentralized storage (IPFS) satisfies creators' expectations for permanent digital asset preservation.", bold_prefix="A-04 (Technical): ")

    add_h2("10.2 Open Product Questions")
    add_bullet("Will mainstream creators accept acquiring testnet ETH from external faucets, or must PixelMint embed a seamless in-app faucet?", bold_prefix="Q-01 (Onboarding): ")
    add_bullet("How can the marketplace protect creators from secondary royalty avoidance on external zero-royalty platforms without restrictive operator filters?", bold_prefix="Q-02 (Economics): ")
    add_bullet("What legal Terms of Service and copyright disclaimers are required to protect the platform from user-uploaded copyright violations?", bold_prefix="Q-03 (Legal/Compliance): ")

    add_h2("10.3 Phased Product Roadmap")
    road_headers = ["Phase & Horizon", "Primary Milestone Objective", "Key Deliverables", "Target Validation Gate"]
    road_widths = [1.5, 1.8, 2.2, 1.6]
    road_data = [
        ["Phase 0: Prototype Validation\n(Current Horizon 0)", "Qualitative usability & UI remediation.", "Remove '100% Audited' badge; conduct 8 moderated usability sessions; test fee clarity.", ">= 80% unassisted checkout task completion in user lab."],
        ["Phase 1: Testnet MVP\n(Horizon 1: Next Increment)", "Real Web3 wallet & contract execution.", "Sepolia ERC-721 smart contracts; IPFS media pinning; live wagmi/viem wallet connection.", "Successful end-to-end mint and purchase on Sepolia testnet."],
        ["Phase 2: L2 Production Launch\n(Horizon 2: Commercial)", "Mainnet deployment with low unit fees.", "Deploy on Base/Arbitrum; legal terms of service; creator profile verification; pHash scan.", "100 authentic creator mints; zero smart contract security incidents."],
        ["Phase 3: Creator Intelligence\n(Horizon 3: Future Scale)", "Scale & workflow acceleration.", "AI metadata assistant; batch minting tools; fiat on-ramp; cross-marketplace indexing.", "Creator retention >= 40% month-over-month."]
    ]
    create_custom_table(road_headers, road_widths, road_data, space_after=4)

    add_h2("10.4 Senior PM Retrospective: Lessons Learned & Strategic Reflections")
    add_body(
        "Reflecting on PixelMint through a Senior Product Manager lens highlights the critical transition from academic engineering "
        "to rigorous product management. When this project began as a university capstone, the instinct was to showcase technical breadth: "
        "building multi-screen navigation, complex modal flows, and optimistic Web3 terminology. However, examining the product objectively "
        "reveals that building features without validated user demand is merely technical exercise."
    )
    add_body(
        "The most vital lesson of this retrospective is the paramount importance of technical honesty. In consumer technology—and Web3 "
        "specifically—trust is the single most fragile asset. Labeling a student front-end prototype as '100% Audited' or presenting simulated "
        "client-side state as decentralized blockchain finality creates an illusion of readiness that fails under real scrutiny. By auditing "
        "the codebase, openly acknowledging simulation boundaries, and framing unvalidated beliefs as hypotheses, we transform an engineering "
        "demo into a defensible, professional product strategy."
    )
    add_body(
        "Ultimately, product management is not about claiming to have solved every problem; it is about knowing precisely what you have built, "
        "understanding what you have yet to prove, and defining the disciplined, evidence-based steps required to deliver real user value."
    )

    output_filename = "PixelMint_PRD_Final.docx"
    doc.save(output_filename)
    print(f"Document saved successfully as {output_filename}")

if __name__ == "__main__":
    create_pixelmint_prd_final()
