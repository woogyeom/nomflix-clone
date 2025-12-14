import styled from "styled-components";
import {
	motion,
	useAnimation,
	useMotionValueEvent,
	useScroll,
	Variants,
} from "framer-motion";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	width: 100%;
	height: 70px;
	top: 0;
	font-size: 14px;
	font-weight: 400;
	padding: 20px 50px;
	color: rgba(229, 229, 229, 1);
	z-index: 2;
`;

const navVariants: Variants = {
	initial: {
		backgroundColor: "rgba(19,19,19,1)",
	},
	top: {
		backgroundColor: "rgba(19,19,19,0)",
	},
	scroll: {
		backgroundColor: "rgba(19,19,19,1)",
	},
};

const Col = styled.div`
	display: flex;
	align-items: center;
	gap: 50px;
`;

const Logo = styled(motion.svg)`
	width: 95px;
	height: 25px;
	fill: ${(props) => props.theme.red};
	display: block;
`;

const Items = styled.ul`
	display: flex;
	align-items: center;
`;

const Item = styled(motion.li)<{ $isActive: boolean }>`
	margin-right: 20px;
	color: ${(props) => props.theme.white.darker};
	position: relative;
	a {
		display: block;
		cursor: ${(props) => (props.$isActive ? "default" : "pointer")};
	}
`;

const itemVariants = {
	normal: {
		opacity: 1,
	},
	hover: {
		opacity: 0.5,
	},
	selected: {
		opacity: 1,
		fontWeight: 700,
	},
};

const Search = styled.form`
	color: white;
	display: flex;
	align-items: center;
	position: relative;
	svg {
		height: 25px;
		cursor: pointer;
	}
`;

const Input = styled(motion.input)`
	transform-origin: right center;
	position: absolute;
	right: 0px;
	padding: 7px 10px;
	padding-left: 40px;
	z-index: -1;
	color: white;
	font-size: 14px;
	font-weight: 500;
	background-color: black;
	border: 1px solid ${(props) => props.theme.white.lighter};
`;

interface IForm {
	keyword: string;
}

function Header() {
	const [searchOpen, setSearchOpen] = useState(false);

	const searchRef = useRef<HTMLInputElement>(null);

	const isHome = useRouteMatch("/")?.isExact;
	const isTv = useRouteMatch("/tvs");
	// const isSearch = useRouteMatch("/search");

	const inputAnimation = useAnimation();
	const navAnimation = useAnimation();
	const { scrollY } = useScroll();

	const toggleSearch = () => {
		if (searchOpen) {
			inputAnimation.start({
				scaleX: 0,
			});
		} else {
			inputAnimation.start({
				scaleX: 1,
			});
		}
		setSearchOpen((prev) => !prev);
	};

	const { register, handleSubmit, setValue } = useForm<IForm>();
	const { ref: registerRef, ...rest } = register("keyword", {
		required: true,
		minLength: 2,
	});
	const history = useHistory();

	const onValid = (data: IForm) => {
		history.push(`/search?keyword=${data.keyword}`);
	};

	// 스크롤 내리면 Nav 검정 배경
	useMotionValueEvent(scrollY, "change", (event) => {
		if (event > 80) {
			navAnimation.start("scroll");
		} else {
			navAnimation.start("top");
		}
	});

	// 첫 렌더링 때도 확인(새로고침 시)
	useEffect(() => {
		if (scrollY.get() > 80) {
			navAnimation.start("scroll");
		} else {
			navAnimation.start("top");
		}
	}, []);

	// 검색 버튼 누르면 인풋 자동 포커스
	useEffect(() => {
		if (searchOpen && searchRef.current) {
			searchRef.current.focus();
		}
	}, [searchOpen]);

	// 검색 인풋 바깥 누르면 자동 검색 취소
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!searchOpen) return;
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setSearchOpen(false);
				inputAnimation.start({
					scaleX: 0,
				});
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [searchOpen]);

	return (
		<Nav variants={navVariants} initial={"initial"} animate={navAnimation}>
			<Col>
				<Link to="/">
					<Logo
						onClick={() => {
							!isHome && window.scrollTo(0, 0);
							setValue("keyword", "");
						}}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1024 276.742"
					>
						<path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
					</Logo>
				</Link>
				<Items>
					<Item
						onClick={() => {
							!isHome && window.scrollTo(0, 0);
							setValue("keyword", "");
						}}
						variants={itemVariants}
						$isActive={!!isHome}
						initial="normal"
						whileHover={!isHome ? "hover" : "normal"}
						animate={isHome ? "selected" : "normal"}
					>
						<Link to="/">Home</Link>
					</Item>
					<Item
						onClick={() => {
							!isTv && window.scrollTo(0, 0);
							setValue("keyword", "");
						}}
						variants={itemVariants}
						$isActive={!!isTv}
						initial="normal"
						whileHover={!isTv ? "hover" : "normal"}
						animate={isTv ? "selected" : "normal"}
					>
						<Link to="/tvs">TV Shows</Link>
					</Item>
				</Items>
			</Col>
			<Col>
				<Search onClick={toggleSearch} onSubmit={handleSubmit(onValid)}>
					<motion.svg
						animate={{ x: searchOpen ? -190 : 0 }}
						transition={{ ease: "linear", duration: 0.3 }}
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
					</motion.svg>
					<Input
						{...rest}
						onClick={(event) => event.stopPropagation()}
						id="search"
						ref={(e) => {
							registerRef(e);
							searchRef.current = e;
						}}
						animate={inputAnimation}
						initial={{ scaleX: 0 }}
						transition={{ ease: "linear", duration: 0.3 }}
						placeholder="제목, 사람, 장르"
					/>
				</Search>
			</Col>
		</Nav>
	);
}

export default Header;
